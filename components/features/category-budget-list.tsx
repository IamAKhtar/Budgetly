'use client';

import { useEffect, useState } from 'react';
import { useCategories } from '@/lib/hooks/use-categories';
import { useBudgets } from '@/lib/hooks/use-budgets';
import { monthKey, sumExpensesForCategoryMonth } from '@/lib/budget';
import { formatCurrency } from '@/lib/utils';

export function CategoryBudgetList() {
  const month = monthKey();
  const { categories } = useCategories();
  const { budgets } = useBudgets(month);
  const [spentBy, setSpentBy] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      const map: Record<string, number> = {};
      for (const b of budgets) {
        map[b.categoryId] = await sumExpensesForCategoryMonth(b.categoryId, month);
      }
      setSpentBy(map);
    })();
  }, [budgets, month]);

  return (
    <div className="space-y-3">
      {budgets.map((b) => {
        const cat = categories.find(c => c.id === b.categoryId);
        const spent = spentBy[b.categoryId] ?? 0;
        const remaining = Math.max(0, (b.amount || 0) - spent);
        const pct = Math.min(100, Math.round((spent / Math.max(1, b.amount)) * 100));
        return (
          <div key={b.id} className="rounded-md border p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{cat?.name || 'Category'}</div>
              <div className="text-sm text-muted-foreground">
                {formatCurrency(spent)} / {formatCurrency(b.amount)}
              </div>
            </div>
            <div className="mt-2 h-2 w-full rounded bg-muted">
              <div className="h-2 rounded bg-primary" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Remaining {formatCurrency(remaining)}</div>
          </div>
        );
      })}
      {budgets.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Set monthly budgets on the Budgets page to see category bars here.
        </div>
      )}
    </div>
  );
}
