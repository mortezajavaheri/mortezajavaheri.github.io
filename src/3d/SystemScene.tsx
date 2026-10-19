import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { MathUtils, type Group } from 'three'
import type { SystemEdge, SystemNode } from '@/types/content'
import type { DeviceTier } from '@/hooks/useDeviceTier'
import { Core } from './Core'
import { Connections, type Link } from './Connections'
import { Particles } from './Particles'
import { SystemNodeMesh } from './SystemNodeMesh'
import { motionConfig, quality } from './config'
import { basePositions } from './layout'

export interface SystemSceneProps {
  nodes: SystemNode[]
  edges: SystemEdge[]
  activeId: string | null
  pinnedId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string | null) => void
  tier: DeviceTier
  /** Decorative motion off: scene renders on demand only. */
  reducedMotion: boolean
  /** False when the scene is scrolled out of view — the render loop stops. */
  running: boolean
  /** Shift the system right to leave room for hero copy. */
  align: 'center' | 'right'
}

const DRAG_LIMIT = 0.5
/** World units kept free around the outermost nodes (labels need room). */
const FIT_MARGIN = 0.9
const DRAG_SENSITIVITY = 0.004

/**
 * Pointer interaction: subtle tilt toward the cursor + click-drag to rotate a little.
 * Mouse only — touch keeps native page scrolling.
 */
function useSceneRotation(enabled: boolean) {
  const gl = useThree((s) => s.gl)
  const drag = useRef({ active: false, x: 0, y: 0, rx: 0, ry: 0 })

  useEffect(() => {
    if (!enabled) return
    const el = gl.domElement
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      drag.current.active = true
      drag.current.x = e.clientX
      drag.current.y = e.clientY
    }
    const move = (e: PointerEvent) => {
      const d = drag.current
      if (!d.active) return
      d.ry = MathUtils.clamp(d.ry + (e.clientX - d.x) * DRAG_SENSITIVITY, -DRAG_LIMIT, DRAG_LIMIT)
      d.rx = MathUtils.clamp(d.rx + (e.clientY - d.y) * DRAG_SENSITIVITY, -DRAG_LIMIT * 0.6, DRAG_LIMIT * 0.6)
      d.x = e.clientX
      d.y = e.clientY
    }
    const up = () => {
      drag.current.active = false
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled, gl])

  return drag
}

function SystemGraph({ nodes, edges, activeId, pinnedId, onHover, onSelect, tier, reducedMotion, align }: SystemSceneProps) {
  const tilt = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const viewportWidth = useThree((s) => s.viewport.width)
  const q = quality[tier]
  const animate = !reducedMotion
  const drag = useSceneRotation(tier === 'high')

  const bases = useMemo(() => basePositions(nodes.length, q.orbitRadius), [nodes.length, q.orbitRadius])

  const links = useMemo<Link[]>(() => {
    const index = new Map(nodes.map((n, i) => [n.id, i]))
    const spokes: Link[] = nodes.map((_, i) => [-1, i] as const)
    const between = edges
      .map(([a, b]) => [index.get(a), index.get(b)] as const)
      .filter((l): l is readonly [number, number] => l[0] !== undefined && l[1] !== undefined)
    return [...spokes, ...between]
  }, [nodes, edges])

  const activeIndex = activeId ? nodes.findIndex((n) => n.id === activeId) : -1

  // Keep the system clear of the hero copy on wide screens; shrink it to fit narrow ones.
  const offsetX = align === 'right' ? Math.min(viewportWidth * 0.2, 3.2) : 0
  const fit = Math.min(1, viewportWidth / ((q.orbitRadius + FIT_MARGIN) * 2))

  useFrame((state, dt) => {
    if (spin.current && animate && activeId === null) spin.current.rotation.y += dt * motionConfig.graphSpin
    if (tilt.current) {
      const follow = tier === 'high' && animate
      const tx = (follow ? -state.pointer.y * motionConfig.pointerTilt : 0) + drag.current.rx
      const ty = (follow ? state.pointer.x * motionConfig.pointerTilt : 0) + drag.current.ry
      tilt.current.rotation.x = MathUtils.damp(tilt.current.rotation.x, tx, 3, dt)
      tilt.current.rotation.y = MathUtils.damp(tilt.current.rotation.y, ty, 3, dt)
      tilt.current.position.x = MathUtils.damp(tilt.current.position.x, offsetX, 4, dt)
    }
  })

  return (
    <group ref={tilt} position={[offsetX, 0, 0]} scale={fit}>
      <group ref={spin} rotation={[0.12, 0.4, 0]}>
        <Core animate={animate} />
        <Connections
          bases={bases}
          links={links}
          activeIndex={activeIndex >= 0 ? activeIndex : null}
          packetsPerLink={q.packetsPerEdge}
          animate={animate}
        />
        {nodes.map((node, i) => (
          <SystemNodeMesh
            key={node.id}
            node={node}
            index={i}
            base={bases[i]!}
            radius={q.nodeRadius}
            orbitRadius={q.orbitRadius}
            active={activeId === node.id}
            pinned={pinnedId === node.id}
            dimmed={activeId !== null && activeId !== node.id}
            animate={animate}
            onHover={onHover}
            onSelect={(id) => onSelect(pinnedId === id ? null : id)}
          />
        ))}
      </group>
      <Particles count={q.particles} animate={animate} />
    </group>
  )
}

/** Hero 3D system. Default export so it can be lazy-loaded. */
export default function SystemScene(props: SystemSceneProps) {
  const q = quality[props.tier]
  const [dpr, setDpr] = useState(q.dpr[1])

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0.8, 7.6], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: q.antialias, alpha: true, powerPreference: 'high-performance' }}
      frameloop={!props.running ? 'never' : props.reducedMotion ? 'demand' : 'always'}
      onPointerMissed={() => props.onSelect(null)}
      style={{ touchAction: 'pan-y' }}
    >
      <PerformanceMonitor
        bounds={() => [40, 58]}
        onDecline={() => setDpr(q.dpr[0])}
        onIncline={() => setDpr(q.dpr[1])}
        flipflops={3}
      />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 6]} intensity={0.8} color="#cfe0ff" />
      <SystemGraph {...props} />
    </Canvas>
  )
}
