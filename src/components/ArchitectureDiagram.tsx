import { motion } from 'framer-motion'
import type { ArchitectureLayer, LayerKind } from '@/types/content'
import { duration, ease } from '@/animations/tokens'
import { usePreferences } from '@/hooks/usePreferences'
import { cn } from '@/lib/cn'

const kindStyle: Record<LayerKind, { dot: string; text: string }> = {
  client: { dot: 'bg-fg-muted', text: 'text-fg-muted' },
  edge: { dot: 'bg-accent', text: 'text-accent' },
  app: { dot: 'bg-accent-strong', text: 'text-accent-strong' },
  domain: { dot: 'bg-ok', text: 'text-ok' },
  infra: { dot: 'bg-warn', text: 'text-warn' },
  data: { dot: 'bg-ok', text: 'text-ok' },
  external: { dot: 'bg-fg-muted', text: 'text-fg-muted' },
  ai: { dot: 'bg-ai', text: 'text-ai' },
}

const ROW = 'grid grid-cols-[minmax(0,1fr)] gap-x-5 sm:grid-cols-[5rem_minmax(0,13rem)_minmax(0,1fr)]'

/** Request-flow diagram: layers top to bottom with packets travelling between them. */
export function ArchitectureDiagram({ layers }: { layers: ArchitectureLayer[] }) {
  const { reducedMotion } = usePreferences()

  return (
    <motion.ol
      className="relative"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
      aria-label="Architecture, from entry point to storage"
    >
      {layers.map((layer, i) => {
        const style = kindStyle[layer.kind]
        return (
          <motion.li
            key={layer.id}
            variants={{
              hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
              visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
            }}
          >
            {i > 0 && (
              <div className={ROW} aria-hidden="true">
                <span className="hidden sm:block" />
                <span className="relative mx-auto block h-8 w-px bg-line-strong sm:ml-8">
                  {!reducedMotion && (
                    <span
                      className="absolute -left-[2px] top-0 size-[5px] rounded-full bg-accent-strong animate-packet"
                      style={{ animationDelay: `${i * 0.22}s`, ['--packet-distance' as string]: '27px' }}
                    />
                  )}
                </span>
              </div>
            )}
            <div className={cn(ROW, 'items-center')}>
              <span className={cn('hidden text-right font-mono text-[10px] uppercase tracking-[0.14em] sm:block', style.text)}>
                {layer.kind}
              </span>
              <div className="group relative border border-line-strong bg-ink-900/80 px-4 py-3 transition-colors hover:border-fg-dim">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-[15px] font-medium text-fg">
                    <span className={cn('size-1.5', style.dot)} aria-hidden="true" />
                    {layer.label}
                  </span>
                  <span className={cn('font-mono text-[10px] uppercase tracking-[0.14em] sm:hidden', style.text)}>{layer.kind}</span>
                </div>
                <p className="mt-1.5 text-[13px] leading-snug text-fg-muted sm:hidden">{layer.detail}</p>
              </div>
              <p className="hidden text-[13.5px] leading-snug text-fg-muted sm:block">{layer.detail}</p>
            </div>
          </motion.li>
        )
      })}
    </motion.ol>
  )
}
