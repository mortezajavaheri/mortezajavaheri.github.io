import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, CanvasTexture, EdgesGeometry, IcosahedronGeometry, type Group, type LineSegments } from 'three'
import { sceneColors } from './config'

/** Radial-gradient texture for a cheap glow (no post-processing). */
function useGlowTexture() {
  const texture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
      g.addColorStop(0, 'rgba(77,141,255,0.55)')
      g.addColorStop(0.35, 'rgba(77,141,255,0.16)')
      g.addColorStop(1, 'rgba(77,141,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, size, size)
    }
    return new CanvasTexture(canvas)
  }, [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

interface CoreProps {
  animate: boolean
}

/** The system core: faceted solid, wireframe shell and two orbit rings. */
export function Core({ animate }: CoreProps) {
  const shell = useRef<LineSegments>(null)
  const ringA = useRef<Group>(null)
  const ringB = useRef<Group>(null)
  const glow = useGlowTexture()

  const shellGeometry = useMemo(() => {
    const source = new IcosahedronGeometry(0.9, 1)
    const edges = new EdgesGeometry(source)
    source.dispose()
    return edges
  }, [])
  useEffect(() => () => shellGeometry.dispose(), [shellGeometry])

  useFrame((_, dt) => {
    if (!animate) return
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.12
      shell.current.rotation.x += dt * 0.04
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.22
    if (ringB.current) ringB.current.rotation.z -= dt * 0.15
  })

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={sceneColors.core}
          emissive="#163170"
          emissiveIntensity={0.35}
          metalness={0.7}
          roughness={0.28}
          flatShading
        />
      </mesh>

      <lineSegments ref={shell} geometry={shellGeometry}>
        <lineBasicMaterial color={sceneColors.coreEdge} transparent opacity={0.3} depthWrite={false} />
      </lineSegments>

      <group rotation={[1.15, 0.25, 0]}>
        <group ref={ringA}>
          <mesh>
            <torusGeometry args={[1.32, 0.005, 3, 128]} />
            <meshBasicMaterial color={sceneColors.lineActive} transparent opacity={0.5} />
          </mesh>
          <mesh position={[1.32, 0, 0]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
        </group>
      </group>

      <group rotation={[1.95, -0.45, 0.3]}>
        <group ref={ringB}>
          <mesh>
            <torusGeometry args={[1.6, 0.004, 3, 128]} />
            <meshBasicMaterial color={sceneColors.line} transparent opacity={0.45} />
          </mesh>
          <mesh position={[-1.6, 0, 0]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshBasicMaterial color={sceneColors.lineActive} toneMapped={false} />
          </mesh>
        </group>
      </group>

      <sprite scale={[2.8, 2.8, 1]} renderOrder={-1}>
        <spriteMaterial map={glow} transparent depthWrite={false} depthTest={false} blending={AdditiveBlending} opacity={0.32} />
      </sprite>

      <pointLight color="#4d8dff" intensity={14} distance={7} decay={2} />
    </group>
  )
}
