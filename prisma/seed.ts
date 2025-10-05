import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = 'local-user';

  // Create default categories
  const expenseCategories = [
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

  const incomeCategories = [
    { name: 'Salary', color: '#059669' },
    { name: 'Bonus', color: '#0891b2' },
    { name: 'Freelance', color: '#7c3aed' },
    { name: 'Refunds', color: '#dc2626' }
  ];

  // Create expense categories
  for (const category of expenseCategories) {
    await prisma.category.upsert({
      where: { id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${userId}` },
      update: {},
      create: {
        id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${userId}`,
        userId,
        name: category.name,
        kind: 'EXPENSE',
        color: category.color
      }
    });
  }

  // Create income categories
  for (const category of incomeCategories) {
    await prisma.category.upsert({
      where: { id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${userId}` },
      update: {},
      create: {
        id: `${category.name.toLowerCase().replace(/\s+/g, '-')}-${userId}`,
        userId,
        name: category.name,
        kind: 'INCOME',
        color: category.color
      }
    });
  }

  // Create default accounts
  const accounts = [
    { name: 'Cash', type: 'CASH', balance: 5000 },
    { name: 'Bank Account', type: 'BANK', balance: 50000 },
    { name: 'Credit Card', type: 'CREDIT', balance: -2000 },
    { name: 'Digital Wallet', type: 'WALLET', balance: 1500 }
  ];

  for (const account of accounts) {
    await prisma.account.upsert({
      where: { id: `${account.name.toLowerCase().replace(/\s+/g, '-')}-${userId}` },
      update: {},
      create: {
        id: `${account.name.toLowerCase().replace(/\s+/g, '-')}-${userId}`,
        userId,
        name: account.name,
        type: account.type as any,
        balance: account.balance
      }
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });