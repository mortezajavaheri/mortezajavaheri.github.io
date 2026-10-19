import { useMemo } from 'react'
import type { SystemEdge, SystemNode } from '@/types/content'
import { cn } from '@/lib/cn'
import { NodeTooltip } from './NodeTooltip'

interface SystemFallbackProps {
  nodes: SystemNode[]
  edges: SystemEdge[]
  activeId: string | null
  pinnedId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
  align: 'center' | 'right'
}

const VIEW = 600
const CENTER = VIEW / 2
const RADIUS = 210

/** 2D system map used when WebGL is unavailable or effects are set to "lite". */
export function SystemFallback({ nodes, edges, activeId, pinnedId, onHover, onSelect, align }: SystemFallbackProps) {
  const points = useMemo(
    () =>
      nodes.map((n, i) => {
        const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
        return { id: n.id, x: CENTER + Math.cos(a) * RADIUS, y: CENTER + Math.sin(a) * RADIUS * 0.82 }
      }),
    [nodes],
  )
  const byId = new Map(points.map((p) => [p.id, p]))
  const isLit = (a: string, b: string) => activeId !== null && (a === activeId || b === activeId)

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        align === 'right' && 'lg:justify-end lg:pr-[4vw]',
      )}
    >
      <div className="relative aspect-square w-[min(92vw,560px)] lg:w-[min(46vw,620px)]">
        <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 size-full" aria-hidden="true">
          <circle cx={CENTER} cy={CENTER} r={RADIUS * 0.55} fill="none" stroke="rgb(77 141 255 / 0.25)" strokeDasharray="2 6" />
          {points.map((p) => (
            <line
              key={`spoke-${p.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke={isLit('core', p.id) || activeId === p.id ? '#79a9ff' : 'rgb(77 141 255 / 0.22)'}
              strokeWidth={1}
              strokeDasharray="4 8"
              className="animate-flow"
            />
          ))}
          {edges.map(([a, b]) => {
            const pa = byId.get(a)
            const pb = byId.get(b)
            if (!pa || !pb) return null
            return (
              <line
                key={`${a}-${b}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={isLit(a, b) ? '#79a9ff' : 'rgb(255 255 255 / 0.08)'}
                strokeWidth={1}
              />
            )
          })}
          <circle cx={CENTER} cy={CENTER} r={34} fill="#0e1524" stroke="#4d8dff" strokeOpacity={0.6} />
          <circle cx={CENTER} cy={CENTER} r={6} fill="#4d8dff" />
        </svg>

        {nodes.map((node) => {
          const p = byId.get(node.id)
          if (!p) return null
          const active = activeId === node.id
          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(p.x / VIEW) * 100}%`, top: `${(p.y / VIEW) * 100}%`, zIndex: active ? 20 : 1 }}
            >
              <button
                type="button"
                aria-pressed={pinnedId === node.id}
                onMouseEnter={() => onHover(node.id)}
                onMouseLeave={() => onHover(null)}
                onFocus={() => onHover(node.id)}
                onBlur={() => onHover(null)}
                onClick={() => onSelect(pinnedId === node.id ? null : node.id)}
                className={cn(
                  'flex items-center gap-2 bg-ink-950/70 px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors',
                  active ? 'text-fg' : 'text-fg-muted hover:text-fg',
                )}
              >
                <span className={cn('size-2 rotate-45', node.level === 'strong' ? 'bg-accent' : 'bg-ai')} aria-hidden="true" />
                {node.label}
              </button>
              {active && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2">
                  <NodeTooltip node={node} pinned={pinnedId === node.id} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
