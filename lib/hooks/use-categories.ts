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

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // Soft delete by suffixing name; avoid breaking references
      await db.categories.update(id, { name: `(archived) ` + id, synced: false, updatedAt: new Date() });
      await queueSync('UPDATE', 'categories', id, { name: `(archived) ` + id });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['categories'] }),
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    createCategory,
    deleteCategory,
  };
}
