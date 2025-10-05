
"use client";

import { useTransactions } from '@/lib/hooks/use-transactions';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { useCategories } from '@/lib/hooks/use-categories';
import { formatCurrency, formatDate } from '@/lib/utils';

export function RecentTransactions() {
  const { transactions, isLoading } = useTransactions();
  const { accounts } = useAccounts();
  const { categories } = useCategories();

  if (isLoading) {
    return <div>Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet. Add your first transaction to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.slice(0, 5).map((transaction) => {
        const account = accounts.find(a => a.id === transaction.accountId);
        const category = categories.find(c => c.id === transaction.categoryId);

        return (
          <div key={transaction.id} className="flex justify-between items-start p-3 rounded-md bg-muted/20">
            <div>
              <h4 className="font-medium">{category?.name || 'Unknown Category'}</h4>
              <p className="text-sm text-muted-foreground">
                {account?.name} • {formatDate(transaction.date)}
              </p>
              {transaction.merchant && (
                <p className="text-xs text-muted-foreground">{transaction.merchant}</p>
              )}
            </div>
            <div className={`font-semibold ${
              transaction.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.type === 'EXPENSE' ? '-' : '+'}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}