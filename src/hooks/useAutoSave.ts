'use client'

import { useEffect, useRef } from 'react'
import { useResumeStore } from '@/store'

export function useAutoSave(delay = 700) {
  const saveToStorage = useResumeStore((s) => s.saveToStorage)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const scheduleAutoSave = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => saveToStorage(), delay)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return { scheduleAutoSave }
}
