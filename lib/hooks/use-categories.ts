import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db/dexie';

export function useCategories() {
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: () => db.categories.toArray(),
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
  };
}