
"use client";

import { getCurrentMonth } from '@/lib/utils';

export function BudgetOverview() {
  const currentMonth = getCurrentMonth();

  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>Budget overview for {currentMonth}</p>
      <p className="text-sm mt-2">Set up budgets to track your spending</p>
    </div>
  );
}