import type { SystemNode } from '@/types/content'
import { proficiencyLabel } from '@/lib/format'
import { cn } from '@/lib/cn'

const accentText = {
  blue: 'text-accent',
  green: 'text-ok',
  violet: 'text-ai',
  amber: 'text-warn',
} as const

/** Technical panel describing one system node. Shared by the 3D scene and the 2D fallback. */
export function NodeTooltip({ node, pinned, id }: { node: SystemNode; pinned: boolean; id?: string }) {
  return (
    <div
      id={id}
      role="tooltip"
      className="w-60 border border-line-strong bg-ink-900/95 px-3.5 py-3 text-left shadow-[0_20px_60px_-20px_rgb(0_0_0/0.8)] backdrop-blur-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn('font-mono text-[11px] font-medium uppercase tracking-[0.14em]', accentText[node.accent])}>
          {node.label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-dim">{pinned ? 'pinned' : 'node'}</span>
      </div>
      <p className="mt-1.5 text-[13px] font-medium text-fg">{node.role}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-fg-muted">{node.description}</p>
      <div className="mt-2.5 flex items-center gap-2 border-t border-line pt-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
        <span className="text-fg-dim">experience</span>
        <span className={cn('size-1.5 rounded-full', node.level === 'strong' ? 'bg-ok' : 'bg-ai')} aria-hidden="true" />
        <span className="text-fg">{proficiencyLabel[node.level]}</span>
      </div>
    </div>
  )
}
