import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { systemEdges, systemNodes } from '@/data/system'
import { useDeviceTier } from '@/hooks/useDeviceTier'
import { usePreferences } from '@/hooks/usePreferences'
import { hasWebGL } from '@/lib/webgl'
import { SystemFallback } from './SystemFallback'

// Three.js + R3F live in their own chunk and load after first paint.
const SystemScene = lazy(() => import('@/3d/SystemScene'))

/** Owns hover / pin state for the hero system and picks 3D vs. 2D rendering. */
export function HeroSystem({ align }: { align: 'center' | 'right' }) {
  const { effects, reducedMotion } = usePreferences()
  const tier = useDeviceTier()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [webgl] = useState(hasWebGL)
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)
  const activeId = hovered ?? pinned

  const onHover = useCallback((id: string | null) => setHovered(id), [])
  const onSelect = useCallback((id: string | null) => setPinned(id), [])

  useEffect(() => {
    if (!pinned) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPinned(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pinned])

  const shared = { nodes: systemNodes, edges: systemEdges, activeId, pinnedId: pinned, onHover, onSelect, align }

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Interactive map of the technologies in this system. Use the node buttons to inspect each one."
      className="absolute inset-0"
    >
      {webgl && effects === 'full' ? (
        <Suspense fallback={null}>
          <div className="absolute inset-0 animate-fade-in">
            <SystemScene {...shared} tier={tier} reducedMotion={reducedMotion} running={inView} />
          </div>
        </Suspense>
      ) : (
        <SystemFallback {...shared} />
      )}
    </div>
  )
}
