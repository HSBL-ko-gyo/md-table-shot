import { useEffect, useState } from 'react'

export function usePersistentState<T>(
  key: string,
  initialValue: T,
  migrate?: (storedValue: T) => T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === null) return initialValue
      const parsed = JSON.parse(stored) as T
      return migrate ? migrate(parsed) : parsed
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // The app still works when storage is unavailable (for example, private mode).
    }
  }, [key, value])

  return [value, setValue] as const
}
