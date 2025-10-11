'use client';

import { useTransactions } from '@/lib/hooks/use-transactions';
import { useCategories } from '@/lib/hooks/use-categories';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function TransactionsPage() {
  const { transactions, isLoading } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useAccounts();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Transactions</h1>
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Recent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {isLoading && <div>Loading…</div>}
          {transactions.map(t => {
            const cat = categories.find(c => c.id === t.categoryId);
            const acc = accounts.find(a => a.id === t.accountId);
            return (
              <div key={t.id} className="flex items-center justify-between rounded border p-2">
                <div className="flex flex-col">
                  <div className="font-medium">{cat?.name || t.type}</div>
                  <div className="text-xs text-muted-foreground">{acc?.name} • {formatDate(t.date)}</div>
                </div>
                <div className={t.type === 'EXPENSE' ? 'text-red-600' : 'text-green-600'}>
                  {t.type === 'EXPENSE' ? '-' : '+'}{formatCurrency(t.amount)}
                </div>
              </div>
            );
          })}
          {!isLoading && transactions.length === 0 && <div className="text-sm text-muted-foreground">No transactions yet</div>}
        </CardContent>
      </Card>
    </div>
  );
}
