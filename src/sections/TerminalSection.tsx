import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { Terminal } from '@/components/Terminal'
import { Reveal } from '@/animations/Reveal'

export function TerminalSection() {
  return (
    <Section id="terminal" component="Terminal" labelledBy="terminal-title" className="overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_60%,rgb(77_141_255/0.07),transparent)]" aria-hidden="true" />
      <div className="relative grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
        <div className="lg:pt-6">
          <SectionHeader
            id="terminal-title"
            index="06"
            eyebrow="Shell access"
            title="Prefer a terminal?"
            description="Same content, different interface. Everything here is optional — run a command or just keep scrolling."
          />
          <Reveal delay={0.15}>
            <dl className="mt-10 space-y-2 font-mono text-[12px]">
              {[
                ['help', 'list commands'],
                ['project 3', 'inspect a system'],
                ['cd contact', 'jump to a section'],
              ].map(([c, d]) => (
                <div key={c} className="flex gap-4">
                  <dt className="w-24 text-fg">{c}</dt>
                  <dd className="text-fg-dim">{d}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
        <Reveal y={30}>
          <Terminal />
        </Reveal>
      </div>
    </Section>
  )
}
