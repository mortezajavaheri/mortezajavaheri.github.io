import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, MousePointer2 } from 'lucide-react'
import { profile } from '@/data/profile'
import { HeroSystem } from '@/components/system/HeroSystem'
import { StatusDot } from '@/components/StatusDot'
import { useBooted } from '@/hooks/useBoot'
import { useClock } from '@/hooks/useClock'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { usePreferences } from '@/hooks/usePreferences'
import { duration, ease } from '@/animations/tokens'

const telemetry = [
  { key: 'lang', value: 'C#' },
  { key: 'runtime', value: '.NET' },
  { key: 'framework', value: 'ASP.NET Core' },
  { key: 'data', value: 'SQL Server' },
  { key: 'focus', value: 'Backend' },
] as const

export function Hero() {
  const booted = useBooted()
  const isDesktop = useIsDesktop()
  const { reducedMotion } = usePreferences()
  const time = useClock(profile.location.timeZone)

  const intro = (delay: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 22 },
    animate: booted ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: duration.slow, ease: ease.out, delay },
  })

  return (
    <section
      id="system"
      data-component="Hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* 3D system: top band on mobile, full-bleed behind the copy on desktop. */}
      <div className="absolute inset-x-0 top-12 h-[46svh] lg:inset-0 lg:h-auto">
        <HeroSystem align={isDesktop ? 'right' : 'center'} />
      </div>

      {/* Legibility gradients — kept narrow so the scene stays visible. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[45%] bg-gradient-to-r from-ink-950/80 to-transparent lg:block"
        aria-hidden="true"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-end px-5 pb-8 pt-[52svh] sm:px-8 lg:justify-center lg:pb-28 lg:pt-28">
        <div className="max-w-[40rem]">
          <motion.p {...intro(0.05)} className="label-mono flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="flex items-center gap-2 text-fg-muted">
              <StatusDot /> Online
            </span>
            <span aria-hidden="true">/</span>
            <span>{profile.location.country}</span>
            <span aria-hidden="true">/</span>
            <span>
              <span className="sr-only">Local time </span>
              <time className="tabular-nums text-fg-muted">{time}</time> {profile.location.utcOffset}
            </span>
          </motion.p>

          <motion.h1
            {...intro(0.12)}
            id="hero-title"
            className="mt-5 text-[clamp(2.9rem,8.5vw,6.25rem)] sm:mt-6 font-semibold leading-[0.92] tracking-[-0.045em]"
          >
            {profile.firstName}
            <br />
            <span className="text-fg/45">{profile.lastName}</span>
          </motion.h1>

          <motion.p {...intro(0.22)} className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[13px] text-fg sm:text-sm">
            {profile.roles.map((role, i) => (
              <span key={role} className="flex items-center gap-3">
                {i > 0 && (
                  <span className="text-accent" aria-hidden="true">
                    /
                  </span>
                )}
                {role}
              </span>
            ))}
          </motion.p>

          <motion.p {...intro(0.3)} className="mt-5 max-w-md text-base leading-relaxed text-fg-muted sm:text-lg">
            {profile.headline}
          </motion.p>

          <motion.div {...intro(0.38)} className="pointer-events-auto mt-7 flex flex-wrap items-center gap-2.5 sm:mt-8 sm:gap-3">
            <a
              href="#about"
              className="group inline-flex h-11 items-center gap-2 bg-fg px-4 text-sm sm:px-5 font-medium text-ink-950 transition-colors hover:bg-white"
            >
              Explore the system
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#terminal"
              className="inline-flex h-11 items-center gap-2 border border-line-strong px-4 font-mono text-[13px] text-fg-muted transition-colors hover:border-fg-dim hover:text-fg"
            >
              <span className="text-accent">$</span> open terminal
            </a>
          </motion.div>

          {isDesktop && (
            <motion.p {...intro(0.6)} className="label-mono mt-10 flex items-center gap-2 text-[10px]">
              <MousePointer2 className="size-3" aria-hidden="true" />
              Hover or tab through the nodes · drag to rotate
            </motion.p>
          )}
        </div>
      </div>

      {/* IDE-style status bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={booted ? { opacity: 1 } : undefined}
        transition={{ duration: duration.slow, delay: 0.7 }}
        className="relative z-10 border-t border-line bg-ink-950/60 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
          <dl className="scrollbar-none flex h-10 items-center gap-6 overflow-x-auto font-mono text-[11px]">
            {telemetry.map((t) => (
              <div key={t.key} className="flex shrink-0 items-center gap-2">
                <dt className="text-fg-dim">{t.key}</dt>
                <dd className="text-fg-muted">{t.value}</dd>
              </div>
            ))}
          </dl>
          <a href="#about" className="label-mono hidden shrink-0 items-center gap-2 hover:text-fg-muted sm:flex">
            Scroll <ArrowDown className="size-3" aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
