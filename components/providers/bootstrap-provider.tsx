// budgetly/components/providers/bootstrap-provider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { db } from '@/lib/db/dexie';
import { DEFAULT_USER_ID, DEFAULT_ACCOUNTS, DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from '@/lib/seeds';
import { useQueryClient } from '@tanstack/react-query';

function uuid() {
  return (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function BootstrapProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    (async () => {
      const [acctCount, catCount] = await Promise.all([
        db.accounts.count(),
        db.categories.count(),
      ]);

      if (acctCount > 0 && catCount > 0) return;

      // Try to hydrate from server if available
      let serverAccounts: any[] = [];
      let serverCategories: any[] = [];

      try {
        const [aRes, cRes] = await Promise.all([
          fetch('/api/accounts').then(r => r.ok ? r.json() : []),
          fetch('/api/categories').then(r => r.ok ? r.json() : []),
        ]);
        serverAccounts = Array.isArray(aRes) ? aRes : [];
        serverCategories = Array.isArray(cRes) ? cRes : [];
      } catch {
        // Ignore network errors; will fall back to local defaults
      }

      const now = new Date();

      // Build accounts payload (server first, fallback to defaults)
      const accounts = (serverAccounts.length ? serverAccounts : DEFAULT_ACCOUNTS.map(a => ({
        id: `seed-${a.name.toLowerCase().replace(/\s+/g, '-')}`,
        userId: DEFAULT_USER_ID,
        name: a.name,
        type: a.type,
        currency: 'INR',
        balance: a.balance,
        archived: false,
        createdAt: now,
        updatedAt: now,
        synced: false,
      }))).map((a: any) => ({
        id: a.id ?? uuid(),
        userId: a.userId ?? DEFAULT_USER_ID,
        name: a.name,
        type: a.type,
        currency: a.currency ?? 'INR',
        balance: typeof a.balance === 'number' ? a.balance : 0,
        archived: !!a.archived,
        createdAt: a.createdAt ? new Date(a.createdAt) : now,
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : now,
        synced: !!a.synced,
      }));

      // Build categories payload (server first, fallback to defaults)
      const defaultCats = [
        ...DEFAULT_EXPENSE_CATEGORIES.map(c => ({ ...c, kind: 'EXPENSE' as const })),
        ...DEFAULT_INCOME_CATEGORIES.map(c => ({ ...c, kind: 'INCOME' as const })),
      ];

      const categories = (serverCategories.length ? serverCategories : defaultCats.map(c => ({
        id: `seed-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
        userId: DEFAULT_USER_ID,
        name: c.name,
        kind: c.kind,
        color: c.color,
        createdAt: now,
        updatedAt: now,
        synced: false,
      }))).map((c: any) => ({
        id: c.id ?? uuid(),
        userId: c.userId ?? DEFAULT_USER_ID,
        name: c.name,
        kind: c.kind,
        color: c.color ?? '#3b82f6',
        createdAt: c.createdAt ? new Date(c.createdAt) : now,
        updatedAt: c.updatedAt ? new Date(c.updatedAt) : now,
        synced: !!c.synced,
      }));

      // Seed Dexie in bulk for performance
      if (acctCount === 0 && accounts.length) {
        await db.accounts.bulkPut(accounts);
      }
      if (catCount === 0 && categories.length) {
        await db.categories.bulkPut(categories);
      }

      // Refresh queries so UI sees the new data
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    })();
  }, [queryClient]);

  return <>{children}</>;
}
