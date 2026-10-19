import type { Accent } from '@/types/content'
import type { DeviceTier } from '@/hooks/useDeviceTier'

/** Accent → hex for 3D materials (kept in sync with CSS tokens). */
export const accentHex: Record<Accent, string> = {
  blue: '#4d8dff',
  green: '#3ecf8e',
  violet: '#a78bfa',
  amber: '#f5a524',
}

export const sceneColors = {
  core: '#0e1524',
  coreEdge: '#4d8dff',
  line: '#3a5a94',
  lineActive: '#79a9ff',
  packet: '#9fc0ff',
  particle: '#7f9cc9',
} as const

export interface QualityProfile {
  dpr: [number, number]
  antialias: boolean
  particles: number
  packetsPerEdge: number
  nodeRadius: number
  orbitRadius: number
}

/** Per-tier budget. Everything expensive scales from here. */
export const quality: Record<DeviceTier, QualityProfile> = {
  high: { dpr: [1, 1.75], antialias: true, particles: 650, packetsPerEdge: 2, nodeRadius: 0.11, orbitRadius: 2.55 },
  low: { dpr: [1, 1.25], antialias: false, particles: 200, packetsPerEdge: 1, nodeRadius: 0.13, orbitRadius: 2.25 },
}

export const motionConfig = {
  /** Radians per second for the whole graph. */
  graphSpin: 0.045,
  /** Node bobbing. */
  bobAmplitude: 0.09,
  bobSpeed: 0.55,
  /** Data packets: edge traversals per second. */
  packetSpeed: 0.32,
  packetSpeedActive: 0.75,
  /** How strongly the scene tilts toward the pointer (radians). */
  pointerTilt: 0.18,
} as const
