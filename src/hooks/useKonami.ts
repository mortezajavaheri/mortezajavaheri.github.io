import { useEffect, useRef } from 'react'

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

/** Calls `onUnlock` whenever the Konami code is typed outside of form fields. */
export function useKonami(onUnlock: () => void) {
  const progress = useRef(0)
  const callback = useRef(onUnlock)

  useEffect(() => {
    callback.current = onUnlock
  }, [onUnlock])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, [contenteditable="true"]')) return
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      progress.current = key === SEQUENCE[progress.current] ? progress.current + 1 : key === SEQUENCE[0] ? 1 : 0
      if (progress.current === SEQUENCE.length) {
        progress.current = 0
        callback.current()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
