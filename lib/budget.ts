// budgetly/lib/budget.ts
import { db } from '@/lib/db/dexie';

export function monthKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export async function totalBudgetForMonth(yyyymm = monthKey()) {
  const rows = await db.budgets.where('month').equals(yyyymm).toArray();
  return rows.reduce((s, r) => s + (r.amount || 0), 0);
}

export async function sumExpensesForMonth(yyyymm = monthKey()) {
  const [y, m] = yyyymm.split('-').map(Number);
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 1);
  const items = await db.transactions
    .filter(t => t.type === 'EXPENSE' && t.date >= from && t.date < to)
    .toArray();
  return items.reduce((s, t) => s + (t.amount || 0), 0);
}

export async function sumExpensesForCategoryMonth(categoryId: string, yyyymm = monthKey()) {
  const [y, m] = yyyymm.split('-').map(Number);
  const from = new Date(y, m - 1, 1);
  const to = new Date(y, m, 1);
  const items = await db.transactions
    .filter(t =>
      t.type === 'EXPENSE' &&
      t.categoryId === categoryId &&
      t.date >= from && t.date < to
    )
    .toArray();
  return items.reduce((s, t) => s + (t.amount || 0), 0);
}

export function remainingDaysInMonth(d = new Date()) {
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  return Math.max(1, end.getDate() - d.getDate() + 1);
}
