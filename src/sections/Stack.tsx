import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import { skillChains, skillGroups, skills, supportingTools } from '@/data/skills'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { Reveal, Stagger, StaggerItem } from '@/animations/Reveal'
import { duration, ease } from '@/animations/tokens'
import { useConnectorPaths } from '@/hooks/useConnectorPaths'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/lib/cn'
import { pad2, proficiencyLabel } from '@/lib/format'

const CYCLE_MS = 3800

const allEdges = (() => {
  const seen = new Set<string>()
  return skillChains
    .flatMap((c) => c.edges)
    .filter(([a, b]) => {
      const key = `${a}->${b}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
})()

export function Stack() {
  const mapRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { amount: 0.3 })
  const { reducedMotion } = usePreferences()
  const { paths, register } = useConnectorPaths(mapRef, allEdges)

  const [chainIndex, setChainIndex] = useState(0)
  const [focusSkill, setFocusSkill] = useState<string | null>(null)
  const [userDriven, setUserDriven] = useState(false)
  const chain = skillChains[chainIndex] ?? skillChains[0]!

  // Auto-cycle relationships until the visitor takes over.
  useEffect(() => {
    if (!inView || userDriven || reducedMotion || focusSkill) return
    const id = window.setInterval(() => setChainIndex((i) => (i + 1) % skillChains.length), CYCLE_MS)
    return () => window.clearInterval(id)
  }, [inView, userDriven, reducedMotion, focusSkill])

  const { litEdges, litNodes } = useMemo(() => {
    const edges = focusSkill ? allEdges.filter(([a, b]) => a === focusSkill || b === focusSkill) : chain.edges
    const nodes = new Set<string>(edges.flat())
    if (focusSkill) nodes.add(focusSkill)
    return { litEdges: new Set(edges.map(([a, b]) => `${a}->${b}`)), litNodes: nodes }
  }, [focusSkill, chain])

  const selectionKey = focusSkill ?? chain.id
  const activeSkill = focusSkill ? skills.find((s) => s.id === focusSkill) : null

  return (
    <Section id="stack" component="Stack" labelledBy="stack-title" className="overflow-hidden">
      <div ref={sectionRef}>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="stack-title"
            index="02"
            eyebrow="Technology map"
            title="Not a list of logos — a dependency graph."
            description="How the tools I use connect into working systems. Solid nodes are what I use professionally; outlined nodes are what I’m actively exploring."
          />
          <Reveal className="flex shrink-0 gap-6 font-mono text-[11px] text-fg-muted lg:pb-2">
            <span className="flex items-center gap-2">
              <span className="size-2 bg-accent" aria-hidden="true" /> {proficiencyLabel.strong}
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2 border border-ai" aria-hidden="true" /> {proficiencyLabel.exploring}
            </span>
          </Reveal>
        </div>

        {/* Relationship selector */}
        <Reveal className="mt-14 border-y border-line py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="scrollbar-none -mx-5 flex min-w-0 gap-1 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Show a relationship">
              {skillChains.map((c, i) => {
                const selected = !focusSkill && i === chainIndex
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setUserDriven(true)
                      setFocusSkill(null)
                      setChainIndex(i)
                    }}
                    className={cn(
                      'relative shrink-0 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors',
                      selected ? 'text-fg' : 'text-fg-dim hover:text-fg-muted',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="chain-active"
                        className="absolute inset-0 border border-accent/50 bg-accent/10"
                        transition={{ duration: duration.base, ease: ease.out }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative">{c.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="min-h-10 lg:max-w-sm lg:text-right" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={selectionKey}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: duration.fast }}
                  className="text-sm leading-relaxed text-fg-muted"
                >
                  {activeSkill ? (
                    <>
                      <span className="text-fg">{activeSkill.label}</span> — {activeSkill.note}
                    </>
                  ) : (
                    chain.description
                  )}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        {/* The map */}
        <div ref={mapRef} className="relative mt-14 lg:mt-16">
          <svg className="pointer-events-none absolute inset-0 size-full overflow-visible" aria-hidden="true">
            {paths.map((p) => (
              <path key={p.key} d={p.d} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth={1} />
            ))}
            {paths
              .filter((p) => litEdges.has(p.key))
              .map((p) => (
                <g key={`${selectionKey}:${p.key}`}>
                  <motion.path
                    d={p.d}
                    fill="none"
                    stroke="rgb(77 141 255 / 0.45)"
                    strokeWidth={1.25}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.7, ease: ease.out }}
                  />
                  <path d={p.d} fill="none" stroke="#9fc0ff" strokeWidth={1.25} strokeDasharray="3 9" className="animate-flow" />
                </g>
              ))}
          </svg>

          <Stagger className="relative grid grid-cols-[minmax(0,1fr)] gap-x-16 gap-y-14 pl-10 sm:grid-cols-2 sm:pl-12 lg:grid-cols-4" gap={0.06}>
            {skillGroups.map((group, gi) => (
              <StaggerItem key={group.id}>
                <h3 className="label-mono flex items-baseline gap-2 border-b border-line pb-3">
                  <span className="text-accent">{pad2(gi + 1)}</span>
                  <span className="text-fg">{group.label}</span>
                </h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-fg-dim">{group.description}</p>
                <ul className="mt-6 space-y-1">
                  {skills
                    .filter((s) => s.group === group.id)
                    .map((skill) => {
                      const lit = litNodes.has(skill.id)
                      const dim = litNodes.size > 0 && !lit
                      return (
                        <li key={skill.id}>
                          <button
                            ref={register(skill.id)}
                            type="button"
                            aria-pressed={focusSkill === skill.id}
                            aria-describedby={`skill-note-${skill.id}`}
                            onMouseEnter={() => setFocusSkill(skill.id)}
                            onMouseLeave={() => setFocusSkill(null)}
                            onFocus={() => setFocusSkill(skill.id)}
                            onBlur={() => setFocusSkill(null)}
                            onClick={() => setUserDriven(true)}
                            className={cn(
                              'group flex w-fit items-center gap-3 py-1.5 text-left transition-opacity duration-300',
                              dim && 'opacity-40',
                            )}
                          >
                            <span
                              className={cn(
                                'size-2 shrink-0 transition-[box-shadow,background-color] duration-300',
                                skill.level === 'strong' ? 'bg-accent' : 'border border-ai',
                                lit && skill.level === 'strong' && 'shadow-[0_0_0_4px_rgb(77_141_255/0.18)]',
                                lit && skill.level === 'exploring' && 'bg-ai/30 shadow-[0_0_0_4px_rgb(167_139_250/0.15)]',
                              )}
                              aria-hidden="true"
                            />
                            <span className={cn('text-[17px] font-medium tracking-[-0.01em] transition-colors', lit ? 'text-fg' : 'text-fg/80')}>
                              {skill.label}
                            </span>
                          </button>
                          <p id={`skill-note-${skill.id}`} className={cn('pl-5 font-mono text-[11px] transition-colors', lit ? 'text-fg-muted' : 'text-fg-dim/80')}>
                            {skill.note}
                          </p>
                        </li>
                      )
                    })}
                </ul>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-16 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-line pt-6 font-mono text-[11.5px]">
          <span className="text-fg-dim">also in the toolbox:</span>
          {supportingTools.map((t, i) => (
            <span key={t} className="text-fg-muted">
              {t}
              {i < supportingTools.length - 1 && <span className="ml-4 text-ink-600">·</span>}
            </span>
          ))}
        </Reveal>
      </div>
    </Section>
  )
}
