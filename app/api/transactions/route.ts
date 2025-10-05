import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 50,
      include: {
        account: true,
        toAccount: true,
        category: true
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({ data });

      // Update account balances
      if (data.type === 'EXPENSE') {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } }
        });
      } else if (data.type === 'INCOME') {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { increment: data.amount } }
        });
      } else if (data.type === 'TRANSFER' && data.toAccountId) {
        await tx.account.update({
          where: { id: data.accountId },
          data: { balance: { decrement: data.amount } }
        });
        await tx.account.update({
          where: { id: data.toAccountId },
          data: { balance: { increment: data.amount } }
        });
      }

      return transaction;
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}