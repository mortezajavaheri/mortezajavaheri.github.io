import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from '@/animations/tokens'

const STEPS = ['INITIALIZING SYSTEM', 'LOADING .NET CORE', 'LOADING ARCHITECTURE', 'LOADING PROJECTS', 'SYSTEM READY'] as const
const STEP_MS = 190
const BAR_CELLS = 18
const SESSION_KEY = 'mj.booted'
/** Never hold the visitor longer than this, even if fonts are slow. */
const MAX_WAIT_MS = 1800

function alreadyBooted() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Short boot sequence on the first visit of a session (~1s).
 * Content renders underneath; this is only an overlay. Any key or click skips it.
 */
export function BootLoader({ onDone, reducedMotion }: { onDone: () => void; reducedMotion: boolean }) {
  const [skip] = useState(() => alreadyBooted() || reducedMotion)
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(!skip)

  useEffect(() => {
    if (skip) {
      onDone()
      return
    }
    let cancelled = false
    const finish = () => {
      if (cancelled) return
      cancelled = true
      try {
        sessionStorage.setItem(SESSION_KEY, '1')
      } catch {
        /* storage unavailable — fine */
      }
      setVisible(false)
      onDone()
    }

    const ticker = window.setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), STEP_MS)
    const minTime = new Promise((r) => setTimeout(r, STEP_MS * (STEPS.length - 1) + 160))
    const fonts = document.fonts?.ready ?? Promise.resolve()
    Promise.all([minTime, fonts]).then(finish)
    const hardStop = window.setTimeout(finish, MAX_WAIT_MS)

    window.addEventListener('keydown', finish, { once: true })
    window.addEventListener('pointerdown', finish, { once: true })
    return () => {
      cancelled = true
      window.clearInterval(ticker)
      window.clearTimeout(hardStop)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('pointerdown', finish)
    }
  }, [skip, onDone])

  const progress = (step + 1) / STEPS.length
  const filled = Math.round(progress * BAR_CELLS)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: ease.out } }}
          role="status"
          aria-label="Loading"
        >
          <motion.div
            className="w-[min(88vw,420px)] font-mono text-[12px] leading-6 text-fg-muted"
            exit={{ y: -12, opacity: 0, transition: { duration: 0.4, ease: ease.out } }}
          >
            <div className="mb-4 flex items-center justify-between text-[11px] tracking-[0.14em] text-fg-dim">
              <span>MJ://SYSTEM</span>
              <span>{Math.round(progress * 100).toString().padStart(3, '0')}%</span>
            </div>
            <div className="flex items-center gap-[3px]" aria-hidden="true">
              {Array.from({ length: BAR_CELLS }, (_, i) => (
                <span key={i} className={i < filled ? 'h-2.5 flex-1 bg-accent' : 'h-2.5 flex-1 bg-ink-700'} />
              ))}
            </div>
            <ul className="mt-4 space-y-0.5">
              {STEPS.slice(0, step + 1).map((s, i) => (
                <li key={s} className={i === STEPS.length - 1 ? 'text-ok' : i === step ? 'text-fg' : undefined}>
                  <span className="text-fg-dim">{i === step && i !== STEPS.length - 1 ? '›' : '✓'}</span> {s}
                  {i === step && i !== STEPS.length - 1 && <span className="animate-blink">_</span>}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[10px] tracking-[0.14em] text-fg-dim">PRESS ANY KEY TO SKIP</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
