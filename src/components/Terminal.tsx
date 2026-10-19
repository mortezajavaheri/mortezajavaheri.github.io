import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { completions, quickCommands, runCommand, type OutputLine, type Tone } from '@/lib/terminal'
import { idb, storageKeys } from '@/lib/idb'
import { useIdbState } from '@/hooks/useIdbState'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/lib/cn'

interface Entry extends OutputLine {
  id: number
  input?: boolean
}

const PROMPT_USER = 'visitor@mj-system'
const TYPE_MS = 32
const LINE_MS = 14
const HISTORY_LIMIT = 50

const toneClass: Record<Tone, string> = {
  fg: 'text-fg',
  muted: 'text-fg-muted',
  dim: 'text-fg-dim',
  accent: 'text-accent-strong',
  ok: 'text-ok',
  warn: 'text-warn',
  ai: 'text-ai',
  error: 'text-[#f47b7b]',
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

let nextId = 0
const entry = (line: OutputLine, input = false): Entry => ({ ...line, id: nextId++, input })

const welcome: Entry[] = [
  entry({ text: 'MJ system shell — interactive, local, no backend.', tone: 'fg' }),
  entry({ text: "Type 'help' or pick a command above. ↑/↓ history · Tab completes.", tone: 'dim' }),
]

/** A small but real shell: parsing, history (IndexedDB), completion, and animated output. */
export function Terminal() {
  const { reducedMotion, notify } = usePreferences()
  const [entries, setEntries] = useState<Entry[]>(welcome)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [history, setHistory] = useIdbState<string[]>(storageKeys.terminalHistory, [])
  const historyIndex = useRef<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => {
      alive.current = false
    }
  }, [])

  // Keep the newest output in view (scrolls the terminal body, never the page).
  useEffect(() => {
    const body = bodyRef.current
    if (body) body.scrollTop = body.scrollHeight
  }, [entries])

  const execute = useCallback(
    async (raw: string) => {
      const command = raw.trim()
      setBusy(true)
      setInput('')
      historyIndex.current = null
      setEntries((e) => [...e, entry({ text: command }, true)])

      const nextHistory = command ? [...history, command].slice(-HISTORY_LIMIT) : history
      if (command) setHistory(nextHistory)
      const result = runCommand(command, { history: nextHistory })

      if (result.effect?.type === 'clear') {
        setEntries([])
      } else if (reducedMotion) {
        setEntries((e) => [...e, ...result.lines.map((l) => entry(l))])
      } else {
        for (const l of result.lines) {
          if (!alive.current) return
          setEntries((e) => [...e, entry(l)])
          await wait(LINE_MS)
        }
      }

      if (result.effect?.type === 'scroll') {
        document.getElementById(result.effect.target)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      } else if (result.effect?.type === 'hired') {
        void idb.set(storageKeys.hired, true)
        notify('Permission granted — recruiter mode unlocked.')
      }
      if (alive.current) setBusy(false)
    },
    [history, setHistory, reducedMotion, notify],
  )

  /** Quick-run: type the command visibly, then run it. */
  const runQuick = async (command: string) => {
    if (busy) return
    if (reducedMotion) return execute(command)
    setBusy(true)
    for (let i = 1; i <= command.length; i++) {
      if (!alive.current) return
      setInput(command.slice(0, i))
      await wait(TYPE_MS)
    }
    await execute(command)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (busy) return
    if (e.key === 'Enter') {
      e.preventDefault()
      void execute(input)
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      if (!history.length) return
      e.preventDefault()
      const current = historyIndex.current ?? history.length
      const next = Math.min(history.length, Math.max(0, current + (e.key === 'ArrowUp' ? -1 : 1)))
      historyIndex.current = next
      setInput(history[next] ?? '')
    } else if (e.key === 'Tab') {
      const match = completions.filter((c) => c.startsWith(input.trim()))
      if (input.trim() && match.length === 1) {
        e.preventDefault()
        setInput(`${match[0]} `)
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    }
  }

  return (
    <div className="overflow-hidden border border-line-strong bg-ink-900 transition-colors focus-within:border-accent/50 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
      {/* Window chrome */}
      <div className="flex h-10 items-center justify-between border-b border-line px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-ink-600" />
          <span className="size-2.5 rounded-full bg-ink-600" />
          <span className="size-2.5 rounded-full bg-ink-600" />
        </div>
        <span className="font-mono text-[11px] text-fg-dim">{PROMPT_USER}: ~</span>
        <span className="font-mono text-[11px] text-fg-dim">bash</span>
      </div>

      {/* Quick commands */}
      <div className="scrollbar-none flex gap-1.5 overflow-x-auto border-b border-line bg-ink-850 px-3 py-2.5" role="group" aria-label="Run a command">
        {quickCommands.map((c) => (
          <button
            key={c}
            type="button"
            disabled={busy}
            onClick={() => void runQuick(c)}
            className="shrink-0 border border-line px-2.5 py-1 font-mono text-[11.5px] text-fg-muted transition-colors hover:border-accent/60 hover:text-fg disabled:opacity-40"
          >
            <span className="text-accent">$</span> {c}
          </button>
        ))}
      </div>

      {/* Output */}
      <div
        ref={bodyRef}
        className="scrollbar-thin h-[380px] overflow-auto px-4 py-4 font-mono text-[12.5px] leading-[1.65] sm:h-[440px] sm:px-5"
        onClick={() => {
          if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
        }}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
      >
        {entries.map((e) =>
          e.input ? (
            <p key={e.id} className="mt-2 whitespace-pre-wrap break-words first:mt-0">
              <span className="text-ok">{PROMPT_USER}</span>
              <span className="text-fg-dim">:~$ </span>
              <span className="text-fg">{e.text}</span>
            </p>
          ) : (
            <p key={e.id} className={cn('min-h-[1.65em] whitespace-pre', toneClass[e.tone ?? 'fg'])}>
              {e.text}
            </p>
          ),
        )}

        <label className="mt-2 flex items-center">
          <span className="sr-only">Terminal command</span>
          <span className="shrink-0 text-ok" aria-hidden="true">
            {PROMPT_USER}
          </span>
          <span className="shrink-0 text-fg-dim" aria-hidden="true">
            :~$&nbsp;
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            readOnly={busy}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            enterKeyHint="go"
            className="min-w-0 flex-1 bg-transparent text-fg caret-accent outline-none"
          />
        </label>
      </div>
    </div>
  )
}
