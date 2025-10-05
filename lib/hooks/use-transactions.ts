import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db, LocalTransaction } from '@/lib/db/dexie';
import { useSync } from './use-sync';
import { nanoid } from 'nanoid';

export function useTransactions() {
  const queryClient = useQueryClient();
  const { queueSync } = useSync();

  const transactionsQuery = useQuery({
    queryKey: ['transactions'],
    queryFn: () => db.transactions.orderBy('date').reverse().limit(50).toArray(),
  });

  const createTransaction = useMutation({
    mutationFn: async (data: Omit<LocalTransaction, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
      const transaction: LocalTransaction = {
        ...data,
        id: nanoid(),
        createdAt: new Date(),
        updatedAt: new Date(),
        synced: false,
      };

      await db.transactions.add(transaction);

      // Update account balance
      if (transaction.type === 'EXPENSE') {
        await db.accounts.where('id').equals(transaction.accountId).modify(account => {
          account.balance -= transaction.amount;
          account.synced = false;
        });
      } else if (transaction.type === 'INCOME') {
        await db.accounts.where('id').equals(transaction.accountId).modify(account => {
          account.balance += transaction.amount;
          account.synced = false;
        });
      } else if (transaction.type === 'TRANSFER' && transaction.toAccountId) {
        await db.accounts.where('id').equals(transaction.accountId).modify(account => {
          account.balance -= transaction.amount;
          account.synced = false;
        });
        await db.accounts.where('id').equals(transaction.toAccountId!).modify(account => {
          account.balance += transaction.amount;
          account.synced = false;
        });
      }

      await queueSync('CREATE', 'transactions', transaction.id, transaction);

      return transaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    createTransaction,
  };
}