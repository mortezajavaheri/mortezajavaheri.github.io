/**
 * Animation budget. All motion in the site pulls from these values,
 * so timing stays consistent and is easy to tune in one place.
 */
export const ease = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  standard: [0.2, 0, 0, 1],
} as const

export const duration = {
  fast: 0.18,
  base: 0.5,
  slow: 0.9,
} as const

export const stagger = {
  tight: 0.04,
  base: 0.07,
  loose: 0.12,
} as const

/** Default scroll-reveal viewport: trigger slightly before fully in view, once. */
export const revealViewport = { once: true, margin: '0px 0px -12% 0px' } as const
