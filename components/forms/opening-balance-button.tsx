'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { useTransactions } from '@/lib/hooks/use-transactions';
import { Select } from '@/components/ui/select';

export function OpeningBalanceButton() {
  const { accounts } = useAccounts();
  const { createTransaction } = useTransactions();
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');

  const submit = async () => {
    const id = accountId || accounts[0]?.id;
    if (!id || !amount) return;
    await createTransaction.mutateAsync({
      userId: 'local-user',
      type: 'INCOME',
      amount: Number(amount),
      currency: 'INR',
      date: new Date(),
      accountId: id,
      categoryId: undefined,
      merchant: 'Opening Balance',
      note: 'Initial funds',
    });
    setAmount('');
  };

  return (
    <div className="flex gap-2">
      <Input type="number" placeholder="₹ opening balance" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <Select value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Select account">
        {accounts.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
      </Select>
      <Button onClick={submit}>Set Opening Balance</Button>
    </div>
  );
}
