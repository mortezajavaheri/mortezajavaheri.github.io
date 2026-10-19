import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { skillGroups, skills } from '@/data/skills'
import { projects } from '@/data/projects'
import { experience } from '@/data/experience'
import { formatPeriod, proficiencyLabel } from './format'

export type Tone = 'fg' | 'muted' | 'dim' | 'accent' | 'ok' | 'warn' | 'ai' | 'error'

export interface OutputLine {
  text: string
  tone?: Tone
}

export type Effect = { type: 'clear' } | { type: 'scroll'; target: string } | { type: 'hired' }

export interface CommandResult {
  lines: OutputLine[]
  effect?: Effect
}

export interface CommandContext {
  history: string[]
}

const line = (text: string, tone?: Tone): OutputLine => ({ text, tone })
const blank = line('')

/** Commands shown as quick-run chips and in `help`. */
export const quickCommands = ['whoami', 'stack', 'projects', 'experience', 'architecture', 'contact'] as const

const sections = ['system', 'about', 'stack', 'experience', 'projects', 'thinking', 'contact']

const commandHelp: Array<[string, string]> = [
  ['whoami', 'who is behind this system'],
  ['stack', 'technologies, grouped by proficiency'],
  ['projects', 'list systems · project <n> for details'],
  ['experience', 'running services'],
  ['architecture', 'how I usually structure a backend'],
  ['contact', 'ways to reach me'],
  ['ls / cd <section>', 'navigate the page'],
  ['history', 'commands you ran (stored locally)'],
  ['clear', 'clear the screen'],
]

// Plain ASCII on purpose: box-drawing glyphs aren't in the web-font subset and would misalign.
const architecture = [
  '  +----------+   HTTPS / JWT   +------------------+',
  '  |  client  | --------------> |   ASP.NET Core   |',
  '  +----------+                 | middleware, auth |',
  '       ^                       +--------+---------+',
  '       | SignalR                        |',
  '       |              +-----------------+-----------------+',
  '       |              v                 v                 v',
  '  +----+-----+  +-------------+  +------------+  +-------------+',
  '  |   hub    |<-| application |  |  Hangfire  |  |   reports   |',
  '  +----------+  |  use cases  |  |    jobs    |  |  QuestPDF   |',
  '                +------+------+  +-----+------+  +------+------+',
  '                       v               |                |',
  '                +-------------+        |                |',
  '                |   domain    |        |                |',
  '                +------+------+        |                |',
  '                       v               v                v',
  '         +--------------------------------------------------+',
  '         |   Dapper / EF Core  ----------->  SQL Server     |',
  '         +--------------------------------------------------+',
]

function whoami(): CommandResult {
  return {
    lines: [line(profile.handle, 'fg'), line(profile.roles[0]!.toLowerCase(), 'muted'), line('backend engineer', 'muted'), line(`${profile.location.country.toLowerCase()} · ${profile.location.utcOffset}`, 'dim')],
  }
}

function stack(): CommandResult {
  const lines: OutputLine[] = []
  for (const group of skillGroups) {
    lines.push(line(`[${group.label.toLowerCase()}]`, 'accent'))
    for (const s of skills.filter((x) => x.group === group.id)) {
      lines.push(line(`  ${s.level === 'strong' ? '●' : '○'} ${s.label.padEnd(22)} ${s.note}`, s.level === 'strong' ? 'fg' : 'ai'))
    }
    lines.push(blank)
  }
  lines.push(line(`● ${proficiencyLabel.strong}   ○ ${proficiencyLabel.exploring}`, 'dim'))
  return { lines }
}

function listProjects(): CommandResult {
  return {
    lines: [
      ...projects.map((p, i) => line(`  ${String(i + 1).padStart(2, '0')}  ${p.name.padEnd(28)} ${p.category}`, 'fg')),
      blank,
      line('run `project <n>` for architecture details', 'dim'),
    ],
  }
}

function projectDetail(arg: string | undefined): CommandResult {
  const n = Number(arg)
  const p = Number.isInteger(n) ? projects[n - 1] : projects.find((x) => x.id === arg)
  if (!p) return { lines: [line(`project: not found: ${arg ?? '(none)'} — try 1..${projects.length}`, 'error')] }
  return {
    lines: [
      line(p.name, 'accent'),
      line(p.description, 'muted'),
      blank,
      line('architecture:', 'dim'),
      ...p.architecture.map((l, i) => line(`  ${i === 0 ? '  ' : '->'} ${l.label.padEnd(16)} ${l.detail}`, 'fg')),
      blank,
      line(`stack: ${p.technologies.join(', ')}`, 'muted'),
    ],
  }
}

function listExperience(): CommandResult {
  return {
    lines: experience.flatMap((e) => [
      line(`${e.serviceName}  ● ${e.status}  (${formatPeriod(e.period)})`, 'ok'),
      line(`  ${e.title} — ${e.domain}`, 'fg'),
      line(`  ${e.technologies.slice(0, 6).join(' · ')}`, 'muted'),
      blank,
    ]),
  }
}

function contact(): CommandResult {
  const lines = socials.map((s) => line(`  ${s.label.toLowerCase().padEnd(10)} ${s.href ? (s.handle ?? s.href) : '(not linked yet)'}`, s.href ? 'fg' : 'dim'))
  return { lines: [...lines, blank, line('or use the form: cd contact', 'dim')] }
}

function sudo(args: string[]): CommandResult {
  if (args.join(' ').toLowerCase() === 'hire morteza') {
    return {
      lines: [
        line('[sudo] password for visitor: ********', 'dim'),
        line('Verifying credentials... ok', 'muted'),
        line('Permission granted.', 'ok'),
        line('Next step: cd contact', 'accent'),
      ],
      effect: { type: 'hired' },
    }
  }
  return { lines: [line('visitor is not in the sudoers file. This incident will be reported.', 'error')] }
}

/** Parse and run one command line. Pure aside from the returned effect. */
export function runCommand(input: string, ctx: CommandContext): CommandResult {
  const [cmd = '', ...args] = input.trim().split(/\s+/)
  switch (cmd.toLowerCase()) {
    case '':
      return { lines: [] }
    case 'help':
      return {
        lines: [
          line('available commands:', 'dim'),
          ...commandHelp.map(([c, d]) => line(`  ${c.padEnd(20)} ${d}`, 'fg')),
        ],
      }
    case 'whoami':
      return whoami()
    case 'stack':
      return stack()
    case 'projects':
      return listProjects()
    case 'project':
      return projectDetail(args[0])
    case 'experience':
      return listExperience()
    case 'architecture':
      return { lines: architecture.map((l) => line(l, 'muted')) }
    case 'contact':
      return contact()
    case 'ls':
      return { lines: [line(sections.map((s) => `${s}/`).join('  '), 'accent')] }
    case 'cd': {
      const target = (args[0] ?? '').replace(/\/$/, '')
      if (!sections.includes(target)) return { lines: [line(`cd: no such section: ${args[0] ?? ''}`, 'error')] }
      return { lines: [line(`→ /${target}`, 'dim')], effect: { type: 'scroll', target } }
    }
    case 'pwd':
      return { lines: [line('/home/visitor/inside-the-system')] }
    case 'history':
      return { lines: ctx.history.length ? ctx.history.map((h, i) => line(`  ${String(i + 1).padStart(3)}  ${h}`, 'muted')) : [line('(empty)', 'dim')] }
    case 'date':
      return { lines: [line(new Date().toString())] }
    case 'echo':
      return { lines: [line(args.join(' '))] }
    case 'clear':
      return { lines: [], effect: { type: 'clear' } }
    case 'sudo':
      return sudo(args)
    case 'rm':
      return { lines: [line('rm: refusing to operate on production. Nice try.', 'warn')] }
    case 'dotnet':
      return args[0] === 'run'
        ? { lines: [line('Building...', 'dim'), line('Build succeeded.', 'ok'), line('    0 Warning(s)', 'muted'), line('    0 Error(s)', 'muted')] }
        : { lines: [line('Usage: dotnet run', 'dim')] }
    case 'exit':
      return { lines: [line('There is no exit — only more systems. (Scrolling works too.)', 'dim')] }
    default:
      return { lines: [line(`command not found: ${cmd}. Type 'help' for a list.`, 'error')] }
  }
}

export const completions = ['help', 'whoami', 'stack', 'projects', 'project', 'experience', 'architecture', 'contact', 'ls', 'cd', 'pwd', 'history', 'clear', 'date', 'echo']
