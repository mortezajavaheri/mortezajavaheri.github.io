import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, Color, Matrix4, Vector3, type BufferGeometry, type InstancedMesh } from 'three'
import { seededRandom } from '@/lib/random'
import { motionConfig, sceneColors } from './config'
import { nodePositionAt } from './layout'

/** -1 = the core (origin). Otherwise an index into `bases`. */
export type Endpoint = number
export type Link = readonly [Endpoint, Endpoint]

interface ConnectionsProps {
  bases: Vector3[]
  links: Link[]
  /** Index of the active node, or null. */
  activeIndex: number | null
  packetsPerLink: number
  animate: boolean
}

const lineIdle = new Color(sceneColors.line)
const lineActive = new Color(sceneColors.lineActive)
const lineDim = new Color(sceneColors.line).multiplyScalar(0.35)
const packetIdle = new Color(sceneColors.packet).multiplyScalar(0.75)
const packetActive = new Color('#ffffff')
const packetDim = new Color(sceneColors.packet).multiplyScalar(0.25)

const scratch = { a: new Vector3(), b: new Vector3(), p: new Vector3(), m: new Matrix4() }

/** Lines between nodes plus instanced "data packets" travelling along them. */
export function Connections({ bases, links, activeIndex, packetsPerLink, animate }: ConnectionsProps) {
  const lines = useRef<BufferGeometry>(null)
  const packets = useRef<InstancedMesh>(null)
  const positions = useRef<Vector3[]>([])
  const packetCount = links.length * packetsPerLink

  const buffers = useMemo(
    () => ({
      position: new Float32Array(links.length * 6),
      color: new Float32Array(links.length * 6),
    }),
    [links.length],
  )

  /** Per-packet state: which link, how far along, how fast. Mutated in the frame loop. */
  const packetState = useMemo(() => {
    const rand = seededRandom(7)
    return Array.from({ length: packetCount }, (_, i) => ({
      link: Math.floor(i / packetsPerLink),
      t: ((i % packetsPerLink) / packetsPerLink + rand() * 0.3) % 1,
      speed: 0.75 + rand() * 0.5,
    }))
  }, [packetCount, packetsPerLink])
  const state = useRef(packetState)
  useEffect(() => {
    state.current = packetState
  }, [packetState])

  const isLinkActive = (l: Link) => activeIndex !== null && (l[0] === activeIndex || l[1] === activeIndex)

  // Colours only change when the active node changes — not every frame.
  useLayoutEffect(() => {
    const geometry = lines.current
    if (geometry) {
      const colorAttr = geometry.getAttribute('color')
      links.forEach((l, i) => {
        const c = activeIndex === null ? lineIdle : isLinkActive(l) ? lineActive : lineDim
        colorAttr.setXYZ(i * 2, c.r, c.g, c.b)
        colorAttr.setXYZ(i * 2 + 1, c.r, c.g, c.b)
      })
      colorAttr.needsUpdate = true
    }
    const mesh = packets.current
    if (mesh) {
      state.current.forEach((p, i) => {
        const l = links[p.link]
        const c = activeIndex === null ? packetIdle : l && isLinkActive(l) ? packetActive : packetDim
        mesh.setColorAt(i, c)
      })
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isLinkActive is derived from activeIndex
  }, [activeIndex, links, packetCount])

  useFrame((frame, dt) => {
    const t = animate ? frame.clock.elapsedTime : 0
    // Current node positions (same function the meshes use).
    const pos = positions.current
    bases.forEach((base, i) => {
      pos[i] ??= new Vector3()
      nodePositionAt(base, i, t, pos[i])
    })
    const at = (e: Endpoint, out: Vector3) => (e < 0 ? out.set(0, 0, 0) : out.copy(pos[e] ?? base0))

    const geometry = lines.current
    if (geometry) {
      const attr = geometry.getAttribute('position')
      links.forEach((l, i) => {
        at(l[0], scratch.a)
        at(l[1], scratch.b)
        attr.setXYZ(i * 2, scratch.a.x, scratch.a.y, scratch.a.z)
        attr.setXYZ(i * 2 + 1, scratch.b.x, scratch.b.y, scratch.b.z)
      })
      attr.needsUpdate = true
    }

    const mesh = packets.current
    if (!mesh) return
    state.current.forEach((p, i) => {
      const l = links[p.link]
      if (!l) return
      if (animate) {
        const speed = isLinkActive(l) ? motionConfig.packetSpeedActive : motionConfig.packetSpeed
        p.t = (p.t + dt * speed * p.speed) % 1
      }
      at(l[0], scratch.a)
      at(l[1], scratch.b)
      scratch.p.lerpVectors(scratch.a, scratch.b, p.t)
      // Shrink near endpoints so packets appear to enter/leave the nodes.
      const s = Math.sin(Math.PI * p.t)
      scratch.m.makeScale(s, s, s).setPosition(scratch.p)
      mesh.setMatrixAt(i, scratch.m)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <lineSegments frustumCulled={false}>
        <bufferGeometry ref={lines}>
          <bufferAttribute attach="attributes-position" args={[buffers.position, 3]} />
          <bufferAttribute attach="attributes-color" args={[buffers.color, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>

      {packetCount > 0 && (
        <instancedMesh ref={packets} args={[undefined, undefined, packetCount]} frustumCulled={false}>
          <icosahedronGeometry args={[0.032, 0]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  )
}

const base0 = new Vector3()
