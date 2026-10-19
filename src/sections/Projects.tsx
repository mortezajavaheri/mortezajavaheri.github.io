import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { projects } from '@/data/projects'
import { Section } from '@/components/Section'
import { SectionHeader } from '@/components/SectionHeader'
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import { GithubIcon } from '@/components/BrandIcons'
import { Reveal } from '@/animations/Reveal'
import { duration, ease } from '@/animations/tokens'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/lib/cn'
import { contextLabel, pad2 } from '@/lib/format'

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0)
  const tabs = useRef<Array<HTMLButtonElement | null>>([])
  const { reducedMotion } = usePreferences()
  const project = projects[activeIndex] ?? projects[0]!

  const select = (i: number, focus = false) => {
    const next = (i + projects.length) % projects.length
    setActiveIndex(next)
    if (focus) tabs.current[next]?.focus()
  }

  // Roving focus: arrows move between systems, Home/End jump.
  const onKeyDown = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: projects.length - 1,
    }
    const target = keys[e.key]
    if (target === undefined) return
    e.preventDefault()
    select(target, true)
  }

  return (
    <Section id="projects" component="Projects" labelledBy="projects-title" className="border-y border-line bg-ink-900/40">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,transparent,#000_20%,#000_80%,transparent)]" aria-hidden="true" />

      <div className="relative">
        <SectionHeader
          id="projects-title"
          index="04"
          eyebrow="Projects · system registry"
          title={
            <>
              Systems, not screenshots.
            </>
          }
          description="The kinds of systems I build, described the way I’d explain them to another engineer: what it is, how it’s layered, and what makes it hard."
        />

        <div className="mt-14 grid grid-cols-[minmax(0,1fr)] gap-10 lg:mt-20 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-16">
          {/* Registry */}
          <Reveal className="min-w-0">
            <div className="label-mono mb-3 hidden items-center justify-between lg:flex">
              <span>Registry</span>
              <span>{pad2(projects.length)} systems</span>
            </div>
            <div
              role="tablist"
              aria-label="Projects"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-px lg:overflow-visible lg:border-y lg:border-line lg:px-0"
            >
              {projects.map((p, i) => {
                const selected = i === activeIndex
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      tabs.current[i] = el
                    }}
                    role="tab"
                    id={`project-tab-${p.id}`}
                    aria-selected={selected}
                    aria-controls="project-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={cn(
                      'group relative shrink-0 border border-line px-4 py-3 text-left transition-colors lg:flex lg:w-full lg:items-baseline lg:gap-4 lg:border-0 lg:border-b lg:px-4 lg:py-4 lg:last:border-b-0',
                      selected ? 'bg-ink-800/70 text-fg' : 'text-fg-muted hover:bg-ink-850 hover:text-fg',
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="project-active"
                        className="absolute inset-x-0 bottom-0 h-px bg-accent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-px"
                        transition={{ duration: duration.base, ease: ease.out }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="font-mono text-[11px] text-fg-dim">{pad2(i + 1)}</span>
                    <span className="block lg:flex-1">
                      <span className="block whitespace-nowrap text-[15px] font-medium lg:whitespace-normal">{p.name}</span>
                      <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.12em] text-fg-dim">{p.category}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="mt-4 hidden font-mono text-[11px] text-fg-dim lg:block">↑ ↓ to switch systems</p>
          </Reveal>

          {/* Viewer */}
          <div id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${project.id}`} className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                transition={{ duration: duration.base * 0.7, ease: ease.out }}
              >
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em]">
                  <span className="text-accent">sys/{project.id}</span>
                  <span className="text-fg-dim">{project.category}</span>
                  {project.context && (
                    <span className="flex items-center gap-2 text-fg-muted">
                      <span className={cn('size-1.5', project.context === 'professional' ? 'bg-ok' : 'bg-ai')} aria-hidden="true" />
                      {contextLabel[project.context]}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{project.name}</h3>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-[17px]">{project.description}</p>

                <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
                  <div>
                    <h4 className="label-mono mb-6 flex items-center gap-3">
                      Architecture
                      <span className="h-px flex-1 bg-line" aria-hidden="true" />
                      <span className="normal-case tracking-normal text-fg-dim">request flow ↓</span>
                    </h4>
                    <ArchitectureDiagram layers={project.architecture} />
                  </div>

                  <aside className="space-y-10 xl:border-l xl:border-line xl:pl-8">
                    <div>
                      <h4 className="label-mono">Built with</h4>
                      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[12.5px] text-fg-muted sm:grid-cols-3 xl:grid-cols-1">
                        {project.technologies.map((t) => (
                          <li key={t} className="flex items-center gap-2.5">
                            <span className="text-fg-dim" aria-hidden="true">
                              ›
                            </span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="label-mono">Engineering challenges</h4>
                      <ul className="mt-4 space-y-3">
                        {project.challenges.map((c) => (
                          <li key={c} className="border-l border-line-strong pl-3 text-[13.5px] leading-snug text-fg-muted">
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {(project.links.repo || project.links.demo) && (
                      <div className="flex flex-wrap gap-2">
                        {project.links.repo && (
                          <a href={project.links.repo} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 border border-line-strong px-3 text-[13px] text-fg hover:border-fg-dim">
                            <GithubIcon className="size-3.5" /> Source
                          </a>
                        )}
                        {project.links.demo && (
                          <a href={project.links.demo} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 border border-line-strong px-3 text-[13px] text-fg hover:border-fg-dim">
                            Live <ArrowUpRight className="size-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </aside>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}
