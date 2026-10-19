import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Html } from '@react-three/drei'
import { MathUtils, Vector3, type Group, type Mesh } from 'three'
import type { SystemNode } from '@/types/content'
import { NodeTooltip } from '@/components/system/NodeTooltip'
import { cn } from '@/lib/cn'
import { accentHex } from './config'
import { nodePositionAt } from './layout'

interface SystemNodeMeshProps {
  node: SystemNode
  index: number
  base: Vector3
  radius: number
  orbitRadius: number
  active: boolean
  pinned: boolean
  dimmed: boolean
  animate: boolean
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

const world = new Vector3()

export function SystemNodeMesh({
  node,
  index,
  base,
  radius,
  orbitRadius,
  active,
  pinned,
  dimmed,
  animate,
  onHover,
  onSelect,
}: SystemNodeMeshProps) {
  const group = useRef<Group>(null)
  const solid = useRef<Mesh>(null)
  const halo = useRef<Mesh>(null)
  const label = useRef<HTMLButtonElement>(null)
  const color = accentHex[node.accent]
  const tooltipId = `node-tip-${node.id}`

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    nodePositionAt(base, index, animate ? state.clock.elapsedTime : 0, g.position)
    if (solid.current) {
      if (animate) solid.current.rotation.y += dt * 0.7
      const s = MathUtils.damp(solid.current.scale.x, active ? 1.55 : 1, 8, dt)
      solid.current.scale.setScalar(s)
    }
    if (halo.current) {
      const s = MathUtils.damp(halo.current.scale.x, active ? 1.35 : 1, 6, dt)
      halo.current.scale.setScalar(s)
    }
    // Fade labels that sit behind the core so the front of the system stays readable.
    if (label.current) {
      g.getWorldPosition(world)
      const depth = MathUtils.clamp((world.z + orbitRadius) / (orbitRadius * 2), 0, 1)
      label.current.style.opacity = String(active ? 1 : (dimmed ? 0.35 : 0.5) + depth * 0.5)
    }
  })

  const enter = () => {
    onHover(node.id)
    document.body.style.cursor = 'pointer'
  }
  const leave = () => {
    onHover(null)
    document.body.style.cursor = ''
  }

  return (
    <group ref={group} position={base}>
      <mesh ref={solid}>
        <octahedronGeometry args={[radius, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 1.4 : dimmed ? 0.2 : 0.55}
          roughness={0.35}
          metalness={0.25}
          flatShading
        />
      </mesh>

      <Billboard>
        <mesh ref={halo}>
          <ringGeometry args={[radius * 1.9, radius * 2.02, 40]} />
          <meshBasicMaterial color={color} transparent opacity={active ? 0.9 : dimmed ? 0.12 : 0.35} depthWrite={false} />
        </mesh>
      </Billboard>

      {/* Generous invisible hit area so small nodes are easy to hover. */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          enter()
        }}
        onPointerOut={leave}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(node.id)
        }}
      >
        <sphereGeometry args={[radius * 3, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      <Html position={[0, radius * 2.6, 0]} zIndexRange={[30, 10]} style={{ pointerEvents: 'none' }}>
        <div className="-translate-x-1/2 -translate-y-full">
          <button
            ref={label}
            type="button"
            aria-pressed={pinned}
            aria-describedby={active ? tooltipId : undefined}
            onMouseEnter={() => onHover(node.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(node.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(node.id)}
            className={cn(
              'pointer-events-auto whitespace-nowrap px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-200',
              active ? 'bg-ink-900/80 text-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {node.label}
          </button>
        </div>
      </Html>

      {/* Always mounted (drei Html owns a React root); only its content toggles. */}
      <Html position={[0, -radius * 2.4, 0]} zIndexRange={[40, 20]} style={{ pointerEvents: 'none' }}>
        {active && (
          <div className="-translate-x-1/2 pt-1">
            <NodeTooltip node={node} pinned={pinned} id={tooltipId} />
          </div>
        )}
      </Html>
    </group>
  )
}
