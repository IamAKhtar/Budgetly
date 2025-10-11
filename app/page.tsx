import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QuickAddForm } from '@/components/forms/quick-add-form';
import { AccountsOverview } from '@/components/features/accounts-overview';
import { BudgetOverview } from '@/components/features/budget-overview';
import { RecentTransactions } from '@/components/features/recent-transactions';
import { OpeningBalanceButton } from '@/components/forms/opening-balance-button';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Budget Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Add</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <QuickAddForm />
            <div className="pt-2 border-t">
              <OpeningBalanceButton />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <AccountsOverview />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-base">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button asChild><Link href="/mobile">Mobile</Link></Button>
          <Button asChild variant="secondary"><Link href="/budgets">Budgets</Link></Button>
          <Button asChild variant="secondary"><Link href="/categories">Categories</Link></Button>
          <Button asChild variant="secondary"><Link href="/transactions">Transactions</Link></Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
        <CardContent>
            <BudgetOverview />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
