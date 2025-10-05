
"use client"

import { useEffect } from 'react'
import { syncService } from '@/lib/services/sync'

export function SyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize sync service
    syncService.processSyncQueue()
  }, [])

  return <>{children}</>
}