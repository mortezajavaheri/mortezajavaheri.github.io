import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePreferences } from '@/hooks/usePreferences'

const GLYPHS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789/<>_-=+'
const FRAME_MS = 28

interface ScrambleTextProps {
  text: string
  className?: string
  /** Total decode time in ms. */
  durationMs?: number
  /** Start immediately instead of when scrolled into view. */
  immediate?: boolean
}

/** Decodes text from random glyphs into its final value — used for system labels. */
export function ScrambleText({ text, className, durationMs = 650, immediate = false }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const { reducedMotion } = usePreferences()
  const [output, setOutput] = useState(text)

  useEffect(() => {
    if (reducedMotion || !(immediate || inView)) return
    const start = performance.now()
    let last = 0
    let raf = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / durationMs)
      if (now - last > FRAME_MS || progress === 1) {
        last = now
        const revealed = Math.floor(progress * text.length)
        setOutput(
          text
            .split('')
            .map((ch, i) => (i < revealed || ch === ' ' ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join(''),
        )
      }
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      setOutput(text)
    }
  }, [inView, immediate, reducedMotion, text, durationMs])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{output}</span>
    </span>
  )
}
