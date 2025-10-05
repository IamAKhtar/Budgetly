import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, LocalBudget } from '@/lib/db/dexie';
import { monthKey } from '@/lib/budget';
import { useSync } from './use-sync';
import { nanoid } from 'nanoid';

export function useBudgets(activeMonth = monthKey()) {
  const qc = useQueryClient();
  const { queueSync } = useSync();

  const budgetsQuery = useQuery({
    queryKey: ['budgets', activeMonth],
    queryFn: () => db.budgets.where('month').equals(activeMonth).toArray(),
  });

  const upsertBudget = useMutation({
    mutationFn: async (b: Omit<LocalBudget, 'id' | 'createdAt' | 'updatedAt' | 'synced'> & { id?: string }) => {
      const now = new Date();
      const id = b.id ?? nanoid();
      const rec: LocalBudget = { ...b, id, createdAt: now, updatedAt: now, synced: false };
      await db.budgets.put(rec);
      await queueSync('UPDATE', 'budgets', id, rec);
      return rec;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['budgets', activeMonth] }),
  });

  return {
    budgets: budgetsQuery.data || [],
    isLoading: budgetsQuery.isLoading,
    upsertBudget,
  };
}
