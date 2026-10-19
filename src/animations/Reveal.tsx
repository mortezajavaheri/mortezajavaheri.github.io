import { motion, type HTMLMotionProps } from 'framer-motion'
import { usePreferences } from '@/hooks/usePreferences'
import { duration, ease, revealViewport, stagger as staggerTokens } from './tokens'

interface RevealProps extends HTMLMotionProps<'div'> {
  delay?: number
  /** Vertical offset in px before reveal. */
  y?: number
}

/** Fade + rise into view once. Collapses to a plain fade when motion is reduced. */
export function Reveal({ delay = 0, y = 18, children, ...rest }: RevealProps) {
  const { reducedMotion } = usePreferences()
  return (
    <motion.div
      initial={{ opacity: 0, y: reducedMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ duration: reducedMotion ? duration.fast : duration.slow, ease: ease.out, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

interface StaggerProps extends HTMLMotionProps<'div'> {
  gap?: number
  delay?: number
}

/** Parent that reveals its <StaggerItem> children one after another. */
export function Stagger({ gap = staggerTokens.base, delay = 0, children, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: gap, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<'div'>) {
  const { reducedMotion } = usePreferences()
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: reducedMotion ? 0 : 14 },
        visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.out } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
