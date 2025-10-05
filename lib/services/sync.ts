import { db, SyncQueue } from '@/lib/db/dexie';

export class SyncService {
  private isOnline = true;
  private syncInProgress = false;

  constructor() {
    this.setupOnlineListener();
  }

  private setupOnlineListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.processSyncQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  async queueOperation(
    operation: 'CREATE' | 'UPDATE' | 'DELETE',
    table: string,
    recordId: string,
    data: any
  ) {
    await db.syncQueue.add({
      operation,
      table,
      recordId,
      data,
      timestamp: new Date(),
      retries: 0,
    });

    if (this.isOnline) {
      this.processSyncQueue();
    }
  }

  async processSyncQueue() {
    if (this.syncInProgress || !this.isOnline) return;

    this.syncInProgress = true;

    try {
      const queueItems = await db.syncQueue.orderBy('timestamp').limit(10).toArray();

      for (const item of queueItems) {
        try {
          await this.syncItem(item);
          await db.syncQueue.delete(item.id!);
        } catch (error) {
          console.error('Sync error:', error);

          // Increment retry count
          await db.syncQueue.update(item.id!, {
            retries: item.retries + 1,
          });

          // Remove item if too many retries
          if (item.retries >= 3) {
            await db.syncQueue.delete(item.id!);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  private async syncItem(item: SyncQueue) {
    const endpoint = `/api/${item.table}`;
    const method = item.operation === 'CREATE' ? 'POST' : 
                   item.operation === 'UPDATE' ? 'PUT' : 'DELETE';

    const response = await fetch(
      item.operation === 'DELETE' ? `${endpoint}/${item.recordId}` : endpoint,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: item.operation !== 'DELETE' ? JSON.stringify(item.data) : undefined,
      }
    );

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    // Mark local record as synced
    const table = (db as any)[item.table];
    await table.update(item.recordId, { synced: true });
  }
}

export const syncService = new SyncService();