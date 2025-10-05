
"use client";

import { useAccounts } from '@/lib/hooks/use-accounts';
import { formatCurrency } from '@/lib/utils';

export function AccountsOverview() {
  const { accounts, isLoading } = useAccounts();

  if (isLoading) {
    return <div>Loading accounts...</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No accounts found. Create your first account to get started.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div key={account.id} className="flex justify-between items-center p-3 rounded-md bg-muted/20">
          <div>
            <h4 className="font-medium">{account.name}</h4>
            <p className="text-sm text-muted-foreground capitalize">{account.type.toLowerCase()}</p>
          </div>
          <div className={`font-semibold ${account.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(account.balance)}
          </div>
        </div>
      ))}
    </div>
  );
}