import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Points } from 'three'
import { seededRandom } from '@/lib/random'
import { sceneColors } from './config'

interface ParticlesProps {
  count: number
  animate: boolean
}

/** Sparse dust in a spherical shell around the system. One draw call. */
export function Particles({ count, animate }: ParticlesProps) {
  const points = useRef<Points>(null)

  const positions = useMemo(() => {
    const rand = seededRandom(42)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.4 + rand() * 6
      const theta = rand() * Math.PI * 2
      const phi = Math.acos(2 * rand() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.55
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    return arr
  }, [count])

  useFrame((_, dt) => {
    if (animate && points.current) points.current.rotation.y += dt * 0.012
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} sizeAttenuation color={sceneColors.particle} transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}
