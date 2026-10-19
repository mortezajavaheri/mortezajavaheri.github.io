import { cn } from '@/lib/cn'

const tones = {
  ok: 'bg-ok',
  accent: 'bg-accent',
  warn: 'bg-warn',
  ai: 'bg-ai',
  idle: 'bg-fg-dim',
} as const

/** Small live indicator with an optional pulse ring. */
export function StatusDot({ tone = 'ok', pulse = true, className }: { tone?: keyof typeof tones; pulse?: boolean; className?: string }) {
  return (
    <span className={cn('relative inline-flex size-1.5 shrink-0', className)} aria-hidden="true">
      {pulse && <span className={cn('absolute inset-0 rounded-full animate-pulse-dot', tones[tone])} />}
      <span className={cn('relative size-1.5 rounded-full', tones[tone])} />
    </span>
  )
}
