import { useCallback } from 'react';
import { db } from '@/lib/db/dexie';

export function useSync() {
  const queueSync = useCallback(async (
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    recordId: string,
    data: any
  ) => {
    await db.syncQueue.add({
      operation,
      table,
      recordId,
      data,
      timestamp: new Date(),
      retries: 0,
    });
  }, []);

  return { queueSync };
}