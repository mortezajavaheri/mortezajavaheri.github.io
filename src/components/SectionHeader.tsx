import type { ReactNode } from 'react'
import { Reveal } from '@/animations/Reveal'
import { ScrambleText } from '@/animations/ScrambleText'
import { cn } from '@/lib/cn'

interface SectionHeaderProps {
  id: string
  index: string
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  className?: string
}

/** Eyebrow (index + decoded label), heading and optional lede. */
export function SectionHeader({ id, index, eyebrow, title, description, className }: SectionHeaderProps) {
  return (
    <header className={cn('max-w-3xl', className)}>
      <div className="label-mono flex items-center gap-3">
        <span className="text-accent">{index}</span>
        <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
        <ScrambleText text={eyebrow} />
      </div>
      <Reveal>
        <h2 id={id} className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-balance sm:text-5xl">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.08}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">{description}</p>
        </Reveal>
      )}
    </header>
  )
}
