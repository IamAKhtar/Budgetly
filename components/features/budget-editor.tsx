'use client';

import { useEffect, useMemo, useState } from 'react';
import { useCategories } from '@/lib/hooks/use-categories';
import { useBudgets } from '@/lib/hooks/use-budgets';
import { monthKey, sumExpensesForCategoryMonth } from '@/lib/budget';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export function BudgetEditor() {
  const activeMonth = monthKey();
  const { categories } = useCategories();
  const { budgets, upsertBudget } = useBudgets(activeMonth);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [spent, setSpent] = useState<Record<string, number>>({});

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of budgets) map[b.categoryId] = b.amount;
    return map;
  }, [budgets]);

  useEffect(() => {
    (async () => {
      const res: Record<string, number> = {};
      for (const c of categories.filter(c => c.kind === 'EXPENSE')) {
        res[c.id] = await sumExpensesForCategoryMonth(c.id, activeMonth);
      }
      setSpent(res);
    })();
  }, [categories, activeMonth]);

  const onSave = async () => {
    const entries = Object.entries(draft);
    for (const [categoryId, value] of entries) {
      const amount = Number(value || '0');
      await upsertBudget.mutateAsync({
        userId: 'local-user',
        categoryId,
        month: activeMonth,
        amount,
        rollover: false,
      });
    }
    setDraft({});
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {categories.filter(c => c.kind === 'EXPENSE').map((c) => {
          const current = draft[c.id] ?? (byCategory[c.id]?.toString() ?? '');
          const mtd = spent[c.id] ?? 0;
          const remaining = (Number(current || 0) || 0) - mtd;
          return (
            <div key={c.id} className="grid grid-cols-12 items-center gap-2">
              <div className="col-span-5">{c.name}</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  placeholder="₹0"
                  value={current}
                  onChange={(e) => setDraft(d => ({ ...d, [c.id]: e.target.value }))}
                />
              </div>
              <div className="col-span-4 text-sm text-muted-foreground">
                Spent {formatCurrency(mtd)} • Remaining {formatCurrency(remaining)}
              </div>
            </div>
          );
        })}

        <div className="flex gap-2">
          <Button onClick={onSave}>Save Budgets</Button>
        </div>
      </CardContent>
    </Card>
  );
}
