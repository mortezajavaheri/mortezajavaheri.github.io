import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface SectionProps {
  id: string
  /** Name shown by the inspect-mode easter egg. */
  component: string
  labelledBy: string
  className?: string
  innerClassName?: string
  children: ReactNode
}

/** Page section with consistent gutters and max width. */
export function Section({ id, component, labelledBy, className, innerClassName, children }: SectionProps) {
  return (
    <section id={id} data-component={component} aria-labelledby={labelledBy} className={cn('relative px-5 py-24 sm:px-8 sm:py-32', className)}>
      <div className={cn('mx-auto w-full max-w-[1240px]', innerClassName)}>{children}</div>
    </section>
  )
}
