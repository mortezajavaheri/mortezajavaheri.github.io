import { createContext, useContext } from 'react'

export type EffectsLevel = 'full' | 'lite'

export interface PreferencesValue {
  /** Visitor choice, persisted in IndexedDB. */
  effects: EffectsLevel
  setEffects: (level: EffectsLevel) => void
  /** System preference OR "lite" effects. Decorative motion should check this. */
  reducedMotion: boolean
  /** Konami easter egg. */
  inspect: boolean
  setInspect: (on: boolean) => void
  notify: (message: string) => void
}

export const PreferencesContext = createContext<PreferencesValue | null>(null)

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used inside <PreferencesProvider>')
  return ctx
}
