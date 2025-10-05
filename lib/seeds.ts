// budgetly/lib/seeds.ts
export const DEFAULT_USER_ID = 'local-user';

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food & Dining', color: '#ef4444' },
  { name: 'Transportation', color: '#f97316' },
  { name: 'Bills & Utilities', color: '#eab308' },
  { name: 'Groceries', color: '#22c55e' },
  { name: 'Shopping', color: '#06b6d4' },
  { name: 'Healthcare', color: '#3b82f6' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Travel', color: '#ec4899' },
  { name: 'Education', color: '#10b981' },
  { name: 'Miscellaneous', color: '#6b7280' }
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Salary', color: '#059669' },
  { name: 'Bonus', color: '#0891b2' },
  { name: 'Refunds', color: '#dc2626' }
];

export const DEFAULT_ACCOUNTS = [
  { name: 'Cash', type: 'CASH' as const, balance: 0 },
  { name: 'Bank Account', type: 'BANK' as const, balance: 0 },
  { name: 'Digital Wallet', type: 'WALLET' as const, balance: 0 },
  { name: 'Credit Card', type: 'CREDIT' as const, balance: 0 }
];
