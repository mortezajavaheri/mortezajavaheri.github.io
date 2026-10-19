import { useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Mail, Send } from 'lucide-react'
import type { SocialId } from '@/types/content'
import { profile } from '@/data/profile'
import { socials } from '@/data/socials'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { GithubIcon, LinkedinIcon } from '@/components/BrandIcons'
import { Reveal } from '@/animations/Reveal'
import { duration, ease } from '@/animations/tokens'
import { useIdbState } from '@/hooks/useIdbState'
import { storageKeys } from '@/lib/idb'
import { cn } from '@/lib/cn'

const icons: Record<SocialId, (p: { className?: string }) => ReactNode> = {
  github: (p) => <GithubIcon {...p} />,
  linkedin: (p) => <LinkedinIcon {...p} />,
  email: (p) => <Mail {...p} strokeWidth={1.5} />,
}

interface Draft {
  name: string
  email: string
  message: string
}

type Response = { status: number; label: string; lines: string[]; tone: 'ok' | 'warn' | 'error' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(d: Draft): string[] {
  const errors: string[] = []
  if (!d.name.trim()) errors.push('name: required')
  if (!EMAIL_RE.test(d.email.trim())) errors.push('email: must be a valid address')
  if (d.message.trim().length < 10) errors.push('message: at least 10 characters')
  return errors
}

function Routes() {
  return (
    <ul className="divide-y divide-line border-y border-line">
      {socials.map((s) => {
        const Icon = icons[s.id]
        const content = (
          <>
            <span className="w-11 font-mono text-[11px] text-ok">GET</span>
            <span className="flex-1">
              <span className="block font-mono text-[12px] text-fg-dim">/{s.id}</span>
              <span className={cn('mt-0.5 flex items-center gap-2.5 text-[17px] font-medium', s.href ? 'text-fg' : 'text-fg-dim')}>
                <Icon className="size-4" />
                {s.label}
              </span>
            </span>
            <span className="font-mono text-[11px] text-fg-dim">
              {s.href ? (
                <ArrowUpRight className="size-4 text-fg-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              ) : (
                'not linked yet'
              )}
            </span>
          </>
        )
        return (
          <li key={s.id}>
            {s.href ? (
              <a
                href={s.href}
                target={s.id === 'email' ? undefined : '_blank'}
                rel="noreferrer"
                className="group flex items-center gap-4 py-4 transition-colors hover:bg-ink-900/60"
                aria-label={`${s.label}${s.handle ? ` (${s.handle})` : ''}`}
              >
                {content}
              </a>
            ) : (
              <span className="flex cursor-not-allowed items-center gap-4 py-4" aria-disabled="true" title="Link not configured yet">
                {content}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function Field({ name, label, children }: { name: string; label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-3">
      <label htmlFor={`contact-${name}`} className="pt-1 text-fg-dim">
        <span className="tok-str">&quot;{name}&quot;</span>
        <span className="text-fg-dim">:</span>
        <span className="sr-only"> {label}</span>
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full border-b border-line-strong bg-transparent px-0 py-1 text-[14px] text-fg placeholder:text-fg-dim/70 transition-colors focus:border-accent focus:outline-none'

function RequestPanel() {
  const [draft, setDraft] = useIdbState<Draft>(storageKeys.contactDraft, { name: '', email: '', message: '' })
  const [response, setResponse] = useState<Response | null>(null)

  const update = (key: keyof Draft) => (e: { target: { value: string } }) => setDraft((d) => ({ ...d, [key]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errors = validate(draft)
    if (errors.length) {
      setResponse({ status: 422, label: 'Unprocessable Entity', lines: errors, tone: 'error' })
      return
    }
    if (!profile.email) {
      setResponse({
        status: 503,
        label: 'Service Unavailable',
        lines: ['The contact address isn’t configured yet.', 'Your draft is saved in this browser — please try a link on the left.'],
        tone: 'warn',
      })
      return
    }
    const subject = encodeURIComponent(`Hello from ${draft.name.trim()}`)
    const body = encodeURIComponent(`${draft.message.trim()}\n\n— ${draft.name.trim()} <${draft.email.trim()}>`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setResponse({ status: 202, label: 'Accepted', lines: ['Your email app should open with the message ready to send.'], tone: 'ok' })
  }

  const statusTone = { ok: 'bg-ok', warn: 'bg-warn', error: 'bg-[#f47b7b]' }

  return (
    <form onSubmit={submit} noValidate className="border border-line-strong bg-ink-900/80" aria-describedby="contact-help">
      <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3 font-mono text-[12px] sm:px-5">
        <span className="bg-accent/15 px-2 py-0.5 font-semibold text-accent-strong">POST</span>
        <span className="text-fg">/contact</span>
        <span className="ml-auto text-fg-dim">application/json</span>
      </div>

      <div className="space-y-4 px-4 py-5 font-mono text-[12.5px] sm:px-5">
        <p className="tok-punc">{'{'}</p>
        <div className="space-y-4 pl-3 sm:pl-5">
          <Field name="name" label="Your name">
            <input id="contact-name" name="name" autoComplete="name" value={draft.name} onChange={update('name')} placeholder="Ada Lovelace" className={inputClass} />
          </Field>
          <Field name="email" label="Your email">
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              value={draft.email}
              onChange={update('email')}
              placeholder="ada@example.com"
              className={inputClass}
            />
          </Field>
          <Field name="message" label="Message">
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              value={draft.message}
              onChange={update('message')}
              placeholder="What are you building?"
              className={cn(inputClass, 'resize-none leading-relaxed')}
            />
          </Field>
        </div>
        <p className="tok-punc">{'}'}</p>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p id="contact-help" className="text-[12.5px] text-fg-dim">
          Opens your email app — nothing is stored on a server. Drafts stay in your browser.
        </p>
        <button
          type="submit"
          className="group inline-flex h-10 shrink-0 items-center justify-center gap-2 bg-fg px-4 text-sm font-medium text-ink-950 transition-colors hover:bg-white"
        >
          Send message
          <Send className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </button>
      </div>

      <AnimatePresence>
        {response && (
          <motion.div
            key={response.status}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: duration.base * 0.7, ease: ease.out }}
            className="overflow-hidden border-t border-line bg-ink-950/60"
            role="status"
          >
            <div className="px-4 py-4 font-mono text-[12px] sm:px-5">
              <p className="flex items-center gap-2.5">
                <span className={cn('size-1.5 rounded-full', statusTone[response.tone])} aria-hidden="true" />
                <span className="text-fg">
                  {response.status} {response.label}
                </span>
              </p>
              <ul className="mt-2 space-y-0.5 text-fg-muted">
                {response.lines.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}

export function Contact() {
  return (
    <Section id="contact" component="Contact" labelledBy="contact-title" className="pb-16 sm:pb-20">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <SectionHeader
            id="contact-title"
            index="07"
            eyebrow="Contact · open endpoint"
            title={
              <>
                Let’s build something <span className="text-fg-dim">that holds up.</span>
              </>
            }
            description="Backend roles, .NET projects, or a system that needs untangling — send a request."
          />
          <Reveal delay={0.1} className="mt-12">
            <Routes />
          </Reveal>
        </div>
        <Reveal y={28} className="lg:pt-14">
          <RequestPanel />
        </Reveal>
      </div>
    </Section>
  )
}
