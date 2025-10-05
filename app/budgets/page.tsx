import { BudgetEditor } from '@/components/features/budget-editor';

export default function BudgetsPage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Budgets</h1>
      <BudgetEditor />
    </div>
  );
}
