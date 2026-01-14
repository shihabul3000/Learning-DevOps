
import { Account, Transaction, AccountType, AccountLevel, FinancialSummary, JournalEntry, VoucherType } from './types';

// Validates that the total debit equals total credit in a journal entry.
export const validateJournal = (entries: JournalEntry[]): boolean => {
  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0);
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0);
  return Math.abs(totalDebit - totalCredit) < 0.01;
};

// Calculates current account balances by iterating through transactions for a SPECIFIC year.
export const calculateBalances = (accounts: Account[], transactions: Transaction[]): Account[] => {
  // 1. Initialize all balances to zero
  const updatedAccounts = accounts.map(acc => ({ ...acc, balance: 0 }));

  // 2. Process transactions for GL Accounts (Level 3) only
  // Note: App state ensures transactions are already filtered by yearId
  transactions.forEach(tx => {
    tx.entries.forEach(entry => {
      const acc = updatedAccounts.find(a => a.id === entry.accountId);
      if (acc && acc.level === AccountLevel.GL) {
        const isDebitIncrease = acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE;
        if (isDebitIncrease) {
          acc.balance += (entry.debit - entry.credit);
        } else {
          acc.balance += (entry.credit - entry.debit);
        }
      }
    });
  });

  // 3. Add opening balances to GL accounts
  // Note: App state ensures accounts[].openingBalance is set for the active year
  updatedAccounts.forEach(acc => {
    if (acc.level === AccountLevel.GL) {
      acc.balance += acc.openingBalance;
    }
  });

  // 4. Roll up GL balances (Level 3) to Group Summary accounts (Level 2)
  updatedAccounts.forEach(groupAcc => {
    if (groupAcc.level === AccountLevel.GROUP) {
      const glChildren = updatedAccounts.filter(a => a.parentAccountId === groupAcc.id);
      const glSum = glChildren.reduce((sum, gl) => sum + gl.balance, 0);
      groupAcc.balance = groupAcc.openingBalance + glSum;
    }
  });

  // 5. Roll up Group Summary balances (Level 2) to Main Accounts (Level 1)
  updatedAccounts.forEach(mainAcc => {
    if (mainAcc.level === AccountLevel.MAIN) {
      const groupChildren = updatedAccounts.filter(a => a.parentAccountId === mainAcc.id && a.level === AccountLevel.GROUP);
      mainAcc.balance = groupChildren.reduce((sum, g) => sum + g.balance, 0);
    }
  });

  // 6. ACCOUNTING LOGIC: Roll Net Profit into Retained Earnings (Code 130000) for Balance Sheet integrity
  const totalIncome = updatedAccounts.find(a => a.level === AccountLevel.MAIN && a.type === AccountType.INCOME)?.balance || 0;
  const totalExpense = updatedAccounts.find(a => a.level === AccountLevel.MAIN && a.type === AccountType.EXPENSE)?.balance || 0;
  const netProfit = totalIncome - totalExpense;

  const retainedEarningsAcc = updatedAccounts.find(a => a.code === '130000' && a.level === AccountLevel.GROUP);
  if (retainedEarningsAcc) {
    retainedEarningsAcc.balance += netProfit;
    const equityMain = updatedAccounts.find(a => a.id === retainedEarningsAcc.parentAccountId);
    if (equityMain) equityMain.balance += netProfit;
  }

  return updatedAccounts;
};

// Provides a financial summary for the active period.
export const getFinancialSummary = (accounts: Account[]): FinancialSummary => {
  const cashGroup = accounts.find(a => a.code === '10000' && a.level === AccountLevel.GROUP);
  const receivableGroup = accounts.find(a => a.code === '20000' && a.level === AccountLevel.GROUP);
  const payableGroup = accounts.find(a => a.code === '70000' && a.level === AccountLevel.GROUP);
  const revenueMain = accounts.find(a => a.level === AccountLevel.MAIN && a.type === AccountType.INCOME);
  const expenseMain = accounts.find(a => a.level === AccountLevel.MAIN && a.type === AccountType.EXPENSE);
  const costOfSalesGroup = accounts.find(a => a.code === '180000' && a.level === AccountLevel.GROUP);

  const totalIncome = revenueMain?.balance || 0;
  const totalExpenses = expenseMain?.balance || 0;

  return {
    cashBalance: cashGroup?.balance || 0,
    receivables: receivableGroup?.balance || 0,
    payables: payableGroup?.balance || 0,
    totalSales: totalIncome,
    totalPurchases: costOfSalesGroup?.balance || 0,
    totalExpenses: totalExpenses,
    netProfit: totalIncome - totalExpenses
  };
};

export const getNextVoucherNo = (type: VoucherType, transactions: Transaction[]): string => {
  const count = transactions.filter(tx => tx.voucherType === type).length + 1;
  const prefix = type.substring(0, 2).toUpperCase();
  return `${prefix}-${count.toString().padStart(4, '0')}`;
};
