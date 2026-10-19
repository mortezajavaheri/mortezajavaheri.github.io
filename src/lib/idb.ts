/**
 * Tiny promise wrapper around a single IndexedDB key/value store.
 * Used for local-only visitor state (preferences, terminal history, drafts).
 * Every call degrades to a no-op when IndexedDB is unavailable (private mode, old browsers).
 */
const DB_NAME = 'mj-portfolio'
const STORE = 'kv'
const VERSION = 1

let dbPromise: Promise<IDBDatabase | null> | null = null

function openDb(): Promise<IDBDatabase | null> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null)
    try {
      const request = indexedDB.open(DB_NAME, VERSION)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE)
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    } catch {
      resolve(null)
    }
  })
  return dbPromise
}

function run<T>(mode: IDBTransactionMode, op: (store: IDBObjectStore) => IDBRequest): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve) => {
        if (!db) return resolve(undefined)
        try {
          const request = op(db.transaction(STORE, mode).objectStore(STORE))
          request.onsuccess = () => resolve(request.result as T)
          request.onerror = () => resolve(undefined)
        } catch {
          resolve(undefined)
        }
      }),
  )
}

export const idb = {
  get: <T>(key: string) => run<T>('readonly', (s) => s.get(key)),
  set: <T>(key: string, value: T) => run<IDBValidKey>('readwrite', (s) => s.put(value, key)).then(() => undefined),
  delete: (key: string) => run<undefined>('readwrite', (s) => s.delete(key)).then(() => undefined),
}

/** Keys in one place so nothing collides. */
export const storageKeys = {
  preferences: 'preferences',
  terminalHistory: 'terminal.history',
  contactDraft: 'contact.draft',
  hired: 'easter.hired',
} as const
