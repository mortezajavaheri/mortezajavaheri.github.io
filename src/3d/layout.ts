import { Vector3 } from 'three'
import { motionConfig } from './config'

/**
 * Deterministic node placement: points on a Fibonacci sphere, flattened slightly
 * so the system reads as an orbit rather than a ball. Every consumer
 * (meshes, lines, packets, labels) derives positions from the same function,
 * so they never drift apart.
 */
export function basePositions(count: number, radius: number): Vector3[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - ((i + 0.5) / count) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    return new Vector3(Math.cos(theta) * r * radius, y * radius * 0.62, Math.sin(theta) * r * radius)
  })
}

/** Writes the animated position of node `i` at time `t` into `out`. */
export function nodePositionAt(base: Vector3, i: number, t: number, out: Vector3): Vector3 {
  const phase = i * 1.37
  return out.set(
    base.x + Math.cos(t * motionConfig.bobSpeed * 0.7 + phase) * motionConfig.bobAmplitude * 0.6,
    base.y + Math.sin(t * motionConfig.bobSpeed + phase) * motionConfig.bobAmplitude,
    base.z + Math.sin(t * motionConfig.bobSpeed * 0.8 + phase) * motionConfig.bobAmplitude * 0.6,
  )
}
