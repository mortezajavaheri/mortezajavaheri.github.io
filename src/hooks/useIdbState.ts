import { useCallback, useEffect, useRef, useState } from 'react'
import { idb } from '@/lib/idb'

/**
 * useState persisted to IndexedDB.
 * Returns [value, setValue, hydrated]. Until hydrated, `value` is the initial value.
 */
export function useIdbState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial)
  const [hydrated, setHydrated] = useState(false)
  const touched = useRef(false)

  useEffect(() => {
    let alive = true
    idb.get<T>(key).then((stored) => {
      if (!alive) return
      // Don't clobber a value the user changed before hydration finished.
      if (stored !== undefined && !touched.current) setValue(stored)
      setHydrated(true)
    })
    return () => {
      alive = false
    }
  }, [key])

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      touched.current = true
      setValue((prev) => {
        const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next
        void idb.set(key, resolved)
        return resolved
      })
    },
    [key],
  )

  return [value, update, hydrated] as const
}
