'use client';

import { useEffect, useState } from 'react';
import { monthKey, totalBudgetForMonth, sumExpensesForMonth, remainingDaysInMonth } from '@/lib/budget';
import { useAccounts } from '@/lib/hooks/use-accounts';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

type Kpi = { label: string; value: string; tone?: 'ok' | 'warn' | 'bad' };

export function MobileKPIs() {
  const { accounts } = useAccounts();
  const [kpis, setKpis] = useState<Kpi[]>([]);

  useEffect(() => {
    (async () => {
      const month = monthKey();
      const budget = await totalBudgetForMonth(month);
      const spent = await sumExpensesForMonth(month);
      const stillNeeded = Math.max(0, budget - spent);
      const bankBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);
      const daysLeft = remainingDaysInMonth();
      const dailyBurn = stillNeeded / daysLeft;
      const requiredToday = Math.min(stillNeeded, dailyBurn * 3);
      const availableToday = bankBalance - requiredToday;
      const coverageDays = dailyBurn > 0 ? Math.floor(bankBalance / dailyBurn) : 999;

      const covTone: Kpi['tone'] =
        coverageDays >= daysLeft ? 'ok' : coverageDays >= daysLeft - 3 ? 'warn' : 'bad';

      setKpis([
        { label: 'Still Needed (month)', value: formatCurrency(stillNeeded) },
        { label: 'Required Today (T+3)', value: formatCurrency(requiredToday) },
        { label: 'Available Today', value: formatCurrency(availableToday), tone: availableToday >= 0 ? 'ok' : 'bad' },
        { label: `Coverage Days`, value: `${coverageDays}d`, tone: covTone },
      ]);
    })();
  }, [accounts]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {kpis.map((k) => (
        <Card key={k.label} className={k.tone === 'bad' ? 'border-red-500' : k.tone === 'warn' ? 'border-amber-400' : ''}>
          <CardContent className="p-3">
            <div className="text-xs text-muted-foreground">{k.label}</div>
            <div className="text-lg font-semibold">{k.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
