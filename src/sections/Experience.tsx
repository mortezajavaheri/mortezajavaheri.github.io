import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import type { Experience as ExperienceItem } from '@/types/content'
import { experience } from '@/data/experience'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { StatusDot } from '@/components/StatusDot'
import { Reveal } from '@/animations/Reveal'
import { duration, ease } from '@/animations/tokens'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/lib/cn'
import { formatPeriod, pad2 } from '@/lib/format'

const PIPELINE = ['build', 'test', 'deploy', 'run'] as const

/** BUILD → TEST → DEPLOY → RUN, lighting up in sequence when a service is opened. */
function DeployPipeline() {
  const { reducedMotion } = usePreferences()
  return (
    <ol className="flex items-center gap-0 font-mono text-[10.5px] uppercase tracking-[0.14em]" aria-label="Deployment pipeline: all stages passed">
      {PIPELINE.map((stage, i) => (
        <li key={stage} className="flex items-center">
          {i > 0 && (
            <span className="relative mx-2 h-px w-6 overflow-hidden bg-line-strong sm:w-12" aria-hidden="true">
              <motion.span
                className="absolute inset-0 origin-left bg-ok"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.15 + i * 0.28 }}
              />
            </span>
          )}
          <motion.span
            className="flex items-center gap-1.5"
            initial={{ color: 'var(--color-fg-dim)' }}
            animate={{ color: 'var(--color-fg)' }}
            transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.1 + i * 0.28 }}
          >
            <motion.span
              className="size-1.5 rounded-full"
              initial={{ backgroundColor: 'var(--color-ink-600)' }}
              animate={{ backgroundColor: 'var(--color-ok)' }}
              transition={{ duration: 0.2, delay: reducedMotion ? 0 : 0.1 + i * 0.28 }}
              aria-hidden="true"
            />
            {stage}
          </motion.span>
        </li>
      ))}
    </ol>
  )
}

function Manifest({ item }: { item: ExperienceItem }) {
  const meta: Array<[string, string]> = [
    ['role', item.role],
    ['domain', item.domain],
    ...(item.organization ? ([['org', item.organization]] as Array<[string, string]>) : []),
    ['period', formatPeriod(item.period)],
    ['type', item.kind],
  ]

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10 pb-10 pt-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <DeployPipeline />
        <dl className="mt-7 space-y-2.5 font-mono text-[12px]">
          {meta.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3">
              <dt className="text-fg-dim">{k}:</dt>
              <dd className="text-fg">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8">
          <h4 className="label-mono">Technologies</h4>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-[12px] text-fg-muted">
            {item.technologies.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <h4 className="label-mono">Systems</h4>
          <ul className="mt-3 space-y-1.5 text-sm text-fg-muted">
            {item.systems.map((s) => (
              <li key={s} className="flex items-center gap-2.5">
                <span className="size-1 bg-accent" aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <p className="text-base leading-relaxed text-fg sm:text-[17px]">{item.summary}</p>

        <h4 className="label-mono mt-9">Responsibilities</h4>
        <ul className="mt-4 space-y-2.5">
          {item.responsibilities.map((r) => (
            <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-fg-muted">
              <span className="mt-[0.15em] font-mono text-xs text-accent" aria-hidden="true">
                →
              </span>
              {r}
            </li>
          ))}
        </ul>

        <h4 className="label-mono mt-10">Interesting problems</h4>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {item.problems.map((p, i) => (
            <li key={p.title} className="grid grid-cols-[minmax(0,1fr)] gap-1 py-4 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
              <span className="font-mono text-[11px] text-fg-dim">{pad2(i + 1)}</span>
              <div>
                <p className="text-[15px] font-medium text-fg">{p.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{p.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export function Experience() {
  const [open, setOpen] = useState<string | null>(experience[0]?.id ?? null)

  return (
    <Section id="experience" component="Experience" labelledBy="experience-title">
      <SectionHeader
        id="experience-title"
        index="03"
        eyebrow="Experience · service lifecycle"
        title={
          <>
            Deployed work. <span className="text-fg-dim">Inspect any service.</span>
          </>
        }
        description="Each role is a running service. Open one to see its manifest: what it does, what it’s built with, and the problems it deals with."
      />

      <div className="relative mt-16">
        {/* Lifecycle rail */}
        <div className="absolute bottom-0 left-[1.15rem] top-0 hidden w-px bg-line sm:block" aria-hidden="true" />

        <ul className="border-b border-line">
          {experience.map((item, i) => {
            const isOpen = open === item.id
            const panelId = `exp-panel-${item.id}`
            return (
              <li key={item.id} className="relative border-t border-line">
                <Reveal delay={i * 0.06}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : item.id)}
                      className="group grid w-full grid-cols-[1fr_auto] items-start gap-4 py-7 text-left sm:grid-cols-[2.5rem_1fr_auto] sm:gap-6"
                    >
                      <span className="relative hidden h-full sm:block" aria-hidden="true">
                        <span
                          className={cn(
                            'absolute left-[0.85rem] top-1.5 size-[0.6rem] rotate-45 border transition-colors duration-300',
                            isOpen ? 'border-accent bg-accent' : 'border-fg-dim bg-ink-950 group-hover:border-fg-muted',
                          )}
                        />
                      </span>

                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11.5px]">
                          <span className="text-accent">{item.serviceName}</span>
                          <span className="flex items-center gap-2 uppercase tracking-[0.14em] text-fg-muted">
                            <StatusDot tone={item.status === 'running' ? 'ok' : 'idle'} pulse={item.status === 'running'} />
                            {item.status}
                          </span>
                          <span className="text-fg-dim">{formatPeriod(item.period)}</span>
                        </span>
                        <span className="mt-3 block text-2xl font-semibold tracking-[-0.025em] text-fg sm:text-[2rem]">
                          {item.title}
                          <span className="text-fg-dim"> — {item.domain}</span>
                        </span>
                        <span className="mt-3 block font-mono text-[12px] text-fg-muted">
                          {item.technologies.slice(0, 4).join(' / ')}
                          {item.technologies.length > 4 && <span className="text-fg-dim"> +{item.technologies.length - 4}</span>}
                        </span>
                      </span>

                      <span
                        className={cn(
                          'mt-1 grid size-9 place-items-center border transition-colors duration-300',
                          isOpen ? 'border-accent text-accent' : 'border-line-strong text-fg-muted group-hover:text-fg',
                        )}
                        aria-hidden="true"
                      >
                        <Plus className={cn('size-4 transition-transform duration-300', isOpen && 'rotate-45')} />
                      </span>
                    </button>
                  </h3>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-label={`${item.title} details`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: duration.base, ease: ease.out }}
                        className="overflow-hidden sm:pl-[4rem]"
                      >
                        <Manifest item={item} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
