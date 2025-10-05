import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, LocalAccount } from '@/lib/db/dexie';
import { useSync } from './use-sync';
import { nanoid } from 'nanoid';

export function useAccounts() {
  const queryClient = useQueryClient();
  const { queueSync } = useSync();

  // Use a client-side filter because Dexie indexes can't use boolean keys safely for equals()
  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: () => db.accounts.filter(a => !a.archived).toArray(),
  });

  const createAccount = useMutation({
    mutationFn: async (data: Omit<LocalAccount, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
      const account: LocalAccount = {
        ...data,
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false,
      };

      await db.accounts.add(account);
      await queueSync('CREATE', 'accounts', account.id, account);

      return account;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const updateAccount = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<LocalAccount> }) => {
      const updatedData = {
        ...data,
        updatedAt: new Date(),
        synced: false,
      };

      await db.accounts.update(id, updatedData);
      await queueSync('UPDATE', 'accounts', id, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: async (id: string) => {
      await db.accounts.update(id, { archived: true, synced: false });
      await queueSync('DELETE', 'accounts', id, { archived: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    createAccount,
    updateAccount,
    deleteAccount,
  };
}
