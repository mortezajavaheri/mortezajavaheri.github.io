import { useMemo } from 'react'
import { useMediaQuery } from './useMediaQuery'

export type DeviceTier = 'high' | 'low'

/**
 * Coarse capability guess used to scale 3D work.
 * Phones, touch-first devices and low-core machines get the "low" tier.
 */
export function useDeviceTier(): DeviceTier {
  const small = useMediaQuery('(max-width: 767px)')
  const coarse = useMediaQuery('(pointer: coarse)')
  return useMemo(() => {
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weakCpu = (nav.hardwareConcurrency ?? 8) <= 4
    const lowMemory = (nav.deviceMemory ?? 8) <= 4
    return small || coarse || weakCpu || lowMemory ? 'low' : 'high'
  }, [small, coarse])
}
