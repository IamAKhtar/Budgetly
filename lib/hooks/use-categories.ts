import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, LocalCategory } from '@/lib/db/dexie';
import { useSync } from './use-sync';
import { nanoid } from 'nanoid';

export function useCategories() {
  const qc = useQueryClient();
  const { queueSync } = useSync();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => db.categories.orderBy('name').toArray(),
  });

  const createCategory = useMutation({
    mutationFn: async (data: Omit<LocalCategory, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
      const now = new Date();
      const rec: LocalCategory = {
        ...data,
        id: nanoid(),
        createdAt: now,
        updatedAt: now,
        synced: false,
      };
      await db.categories.add(rec);
      await queueSync('CREATE', 'categories', rec.id, rec);
      return rec;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LocalCategory> }) => {
      const patch = { ...data, updatedAt: new Date(), synced: false };
      await db.categories.update(id, patch);
      await queueSync('UPDATE', 'categories', id, patch);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  // Soft delete == archive, do not remove referenced rows
  const archiveCategory = useMutation({
    mutationFn: async (id: string) => {
      await db.categories.update(id, { name: '(archived) ' + id, synced: false, updatedAt: new Date() });
      await queueSync('UPDATE', 'categories', id, { name: '(archived) ' + id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    createCategory,
    updateCategory,
    archiveCategory,
  };
}
