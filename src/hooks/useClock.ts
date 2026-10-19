import { useEffect, useState } from 'react'

/** Wall-clock time in a given IANA time zone, updated every `intervalMs`. */
export function useClock(timeZone: string, intervalMs = 1000): string {
  const [time, setTime] = useState(() => format(timeZone))
  useEffect(() => {
    const id = window.setInterval(() => setTime(format(timeZone)), intervalMs)
    return () => window.clearInterval(id)
  }, [timeZone, intervalMs])
  return time
}

function format(timeZone: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())
  } catch {
    return '--:--:--'
  }
}
