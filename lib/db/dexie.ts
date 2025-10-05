import Dexie, { Table } from 'dexie';

export interface LocalAccount {
  id: string;
  userId: string;
  name: string;
  type: 'CASH' | 'BANK' | 'WALLET' | 'CREDIT';
  currency: string;
  balance: number;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
}

export interface LocalCategory {
  id: string;
  userId: string;
  name: string;
  kind: 'EXPENSE' | 'INCOME';
  color: string;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
}

export interface LocalTransaction {
  id: string;
  userId: string;
  type: 'EXPENSE' | 'INCOME' | 'TRANSFER';
  amount: number;
  currency: string;
  date: Date;
  accountId: string;
  toAccountId?: string;
  categoryId?: string;
  merchant?: string;
  note?: string;
  tags?: string[];
  splitOf?: string;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
}

export interface LocalBudget {
  id: string;
  userId: string;
  categoryId: string;
  month: string;
  amount: number;
  rollover: boolean;
  createdAt: Date;
  updatedAt: Date;
  synced?: boolean;
}

export interface SyncQueue {
  id?: number;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  table: string;
  recordId: string;
  data: any;
  timestamp: Date;
  retries: number;
}

export class BudgetlyDB extends Dexie {
  accounts!: Table<LocalAccount>;
  categories!: Table<LocalCategory>;
  transactions!: Table<LocalTransaction>;
  budgets!: Table<LocalBudget>;
  syncQueue!: Table<SyncQueue>;

  constructor() {
    super('BudgetlyDB');

    this.version(1).stores({
      accounts: 'id, userId, name, type, archived, synced',
      categories: 'id, userId, name, kind, synced',
      transactions: 'id, userId, type, date, accountId, categoryId, synced',
      budgets: 'id, userId, categoryId, month, synced',
      syncQueue: '++id, operation, table, recordId, timestamp'
    });
  }
}

export const db = new BudgetlyDB();