import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { PreferencesContext, type EffectsLevel, type PreferencesValue } from '@/hooks/usePreferences'
import { useIdbState } from '@/hooks/useIdbState'
import { useSystemReducedMotion } from '@/hooks/useMediaQuery'
import { storageKeys } from '@/lib/idb'
import { duration, ease } from '@/animations/tokens'

const TOAST_MS = 3200

/** Visitor preferences (persisted in IndexedDB), reduced-motion resolution and toasts. */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useIdbState<{ effects: EffectsLevel }>(storageKeys.preferences, { effects: 'full' })
  const systemReduced = useSystemReducedMotion()
  const [inspect, setInspect] = useState(false)
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const notify = useCallback((message: string) => {
    window.clearTimeout(timer.current)
    setToast({ id: Date.now(), message })
    timer.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  useEffect(() => {
    document.documentElement.toggleAttribute('data-inspect', inspect)
  }, [inspect])

  const reducedMotion = systemReduced || stored.effects === 'lite'

  const value = useMemo<PreferencesValue>(
    () => ({
      effects: stored.effects,
      setEffects: (effects) => setStored({ effects }),
      reducedMotion,
      inspect,
      setInspect,
      notify,
    }),
    [stored.effects, setStored, reducedMotion, inspect, notify],
  )

  return (
    <PreferencesContext.Provider value={value}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
        {children}
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4" role="status" aria-live="polite">
          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: duration.fast * 1.5, ease: ease.out }}
                className="border border-line-strong bg-ink-900/95 px-4 py-2.5 font-mono text-xs text-fg shadow-2xl backdrop-blur"
              >
                <span className="text-accent">›</span> {toast.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MotionConfig>
    </PreferencesContext.Provider>
  )
}
