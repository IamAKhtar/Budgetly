
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { useCategories } from '@/lib/hooks/use-categories';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { cn } from '@/lib/utils';

interface QuickAddFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function QuickAddForm({ onSuccess, className }: QuickAddFormProps) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { createTransaction } = useTransactions();

  const expenseCategories = categories.filter(c => c.kind === 'EXPENSE');
  const defaultAccount = accounts.find(a => a.type === 'CASH') || accounts[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId) return;

    const selectedAccount = accountId || defaultAccount?.id;
    if (!selectedAccount) return;

    try {
      await createTransaction.mutateAsync({
        type: 'EXPENSE',
        amount: parseFloat(amount),
        currency: 'INR',
        date: new Date(),
        accountId: selectedAccount,
        categoryId,
        merchant: merchant || undefined,
        note: note || undefined,
        userId: 'local-user', // Replace with actual user ID
      });

      // Reset form
      setAmount('');
      setCategoryId('');
      setAccountId('');
      setMerchant('');
      setNote('');
      setShowDetails(false);

      onSuccess?.();
    } catch (error) {
      console.error('Failed to add transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)} data-testid="quick-add-form">
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-lg font-medium"
          autoFocus
          min="0"
          step="0.01"
          data-testid="amount-input"
        />
        <span className="flex items-center text-muted-foreground">₹</span>
      </div>

      <Select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        placeholder="Select category"
        data-testid="category-select"
      >
        {expenseCategories.map((category) => (
          <option key={category.id} value={category.id} data-testid={`category-${category.name.toLowerCase()}`}>
            {category.name}
          </option>
        ))}
      </Select>

      {showDetails && (
        <div className="space-y-3 pt-2 border-t">
          <Select
            value={accountId || defaultAccount?.id || ''}
            onChange={(e) => setAccountId(e.target.value)}
            placeholder="Select account"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} (₹{account.balance.toFixed(2)})
              </option>
            ))}
          </Select>

          <Input
            placeholder="Merchant (optional)"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />

          <Input
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button type="submit" disabled={!amount || !categoryId || createTransaction.isPending} data-testid="submit-button">
          {createTransaction.isPending ? 'Adding...' : 'Add Expense'}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Less' : 'More'}
        </Button>
      </div>
    </form>
  );
}