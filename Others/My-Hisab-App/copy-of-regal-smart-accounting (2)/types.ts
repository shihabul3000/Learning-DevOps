
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum AccountLevel {
  MAIN = 1,
  GROUP = 2,
  GL = 3
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  level: AccountLevel;
  parentAccountId?: string;
  balance: number;
  openingBalance: number; // This reflects the opening balance for the ACTIVE financial year
  code: string;
  isSystem?: boolean;
}

export interface JournalEntry {
  accountId: string;
  debit: number;
  credit: number;
}

export type VoucherType = 'SALES' | 'PURCHASE' | 'RECEIPT' | 'PAYMENT' | 'JOURNAL';

export interface Transaction {
  id: string;
  userId: string;
  yearId: string; // Scoped to Financial Year
  voucherNo: string;
  date: string;
  description: string;
  entries: JournalEntry[];
  voucherType: VoucherType;
  reference?: string;
}

export interface FinancialYear {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  isLocked: boolean;
  label: string;
}

export interface AccountYearData {
  id: string; // accountId_yearId
  accountId: string;
  yearId: string;
  userId: string;
  openingBalance: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  photoUrl?: string;
  companyId?: string;
}

export interface FinancialSummary {
  cashBalance: number;
  receivables: number;
  payables: number;
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  netProfit: number;
}

export type ViewType = 'DASHBOARD' | 'TRANSACTIONS' | 'CHART' | 'REPORTS' | 'SETTINGS' | 'ADD_TRANSACTION' | 'LEDGER' | 'AUTH' | 'ONBOARDING' | 'YEAR_MGMT';
