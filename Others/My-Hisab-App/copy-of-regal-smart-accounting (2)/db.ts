
import { Account, Transaction, AccountType, AccountLevel, FinancialYear, AccountYearData } from './types';

const DB_NAME = 'RegalAccountingDB';
const DB_VERSION = 2; // Incremented version for new stores

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains('accounts')) {
        const store = db.createObjectStore('accounts', { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains('transactions')) {
        const store = db.createObjectStore('transactions', { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
        store.createIndex('yearId', 'yearId', { unique: false });
      }

      if (!db.objectStoreNames.contains('financialYears')) {
        const store = db.createObjectStore('financialYears', { keyPath: 'id' });
        store.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains('accountYearData')) {
        const store = db.createObjectStore('accountYearData', { keyPath: 'id' });
        store.createIndex('yearId', 'yearId', { unique: false });
        store.createIndex('userId', 'userId', { unique: false });
      }

      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const seedDefaultAccounts = async (userId: string, db: IDBDatabase) => {
  const transaction = db.transaction('accounts', 'readwrite');
  const store = transaction.objectStore('accounts');

  const defaultAccounts: Omit<Account, 'id'>[] = [
    { userId, name: 'Assets', type: AccountType.ASSET, level: AccountLevel.MAIN, balance: 0, openingBalance: 0, code: '1', isSystem: true },
    { userId, name: 'Liability', type: AccountType.LIABILITY, level: AccountLevel.MAIN, balance: 0, openingBalance: 0, code: '2', isSystem: true },
    { userId, name: 'Equity', type: AccountType.EQUITY, level: AccountLevel.MAIN, balance: 0, openingBalance: 0, code: '3', isSystem: true },
    { userId, name: 'Income', type: AccountType.INCOME, level: AccountLevel.MAIN, balance: 0, openingBalance: 0, code: '4', isSystem: true },
    { userId, name: 'Expense', type: AccountType.EXPENSE, level: AccountLevel.MAIN, balance: 0, openingBalance: 0, code: '5', isSystem: true },

    { userId, name: 'Cash and Cash Equivalent', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '10000', isSystem: true },
    { userId, name: 'Accounts Receivable', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '20000', isSystem: true },
    { userId, name: 'Inventory', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '30000', isSystem: true },
    { userId, name: 'Fixed Assets', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '40000', isSystem: true },
    { userId, name: 'Advance Deposit and Prepayments', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '50000', isSystem: true },
    { userId, name: 'Current Tax Assets', type: AccountType.ASSET, level: AccountLevel.GROUP, parentAccountId: 'm1_FIXED', balance: 0, openingBalance: 0, code: '60000', isSystem: true },

    { userId, name: 'Accounts Payable', type: AccountType.LIABILITY, level: AccountLevel.GROUP, parentAccountId: 'm2_FIXED', balance: 0, openingBalance: 0, code: '70000', isSystem: true },
    { userId, name: 'Advance Received from Customer', type: AccountType.LIABILITY, level: AccountLevel.GROUP, parentAccountId: 'm2_FIXED', balance: 0, openingBalance: 0, code: '80000', isSystem: true },
    { userId, name: 'Borrowings from Bank', type: AccountType.LIABILITY, level: AccountLevel.GROUP, parentAccountId: 'm2_FIXED', balance: 0, openingBalance: 0, code: '90000', isSystem: true },
    { userId, name: 'Current Tax Payable', type: AccountType.LIABILITY, level: AccountLevel.GROUP, parentAccountId: 'm2_FIXED', balance: 0, openingBalance: 0, code: '100000', isSystem: true },
    { userId, name: 'Provision for Expenses', type: AccountType.LIABILITY, level: AccountLevel.GROUP, parentAccountId: 'm2_FIXED', balance: 0, openingBalance: 0, code: '110000', isSystem: true },

    { userId, name: 'Share Capital', type: AccountType.EQUITY, level: AccountLevel.GROUP, parentAccountId: 'm3_FIXED', balance: 0, openingBalance: 0, code: '120000', isSystem: true },
    { userId, name: 'Retained Earnings', type: AccountType.EQUITY, level: AccountLevel.GROUP, parentAccountId: 'm3_FIXED', balance: 0, openingBalance: 0, code: '130000', isSystem: true },
    { userId, name: 'Calls in Arrear', type: AccountType.EQUITY, level: AccountLevel.GROUP, parentAccountId: 'm3_FIXED', balance: 0, openingBalance: 0, code: '140000', isSystem: true },
    { userId, name: 'Share Money Deposit', type: AccountType.EQUITY, level: AccountLevel.GROUP, parentAccountId: 'm3_FIXED', balance: 0, openingBalance: 0, code: '150000', isSystem: true },

    { userId, name: 'Revenue', type: AccountType.INCOME, level: AccountLevel.GROUP, parentAccountId: 'm4_FIXED', balance: 0, openingBalance: 0, code: '160000', isSystem: true },
    { userId, name: 'Other Income', type: AccountType.INCOME, level: AccountLevel.GROUP, parentAccountId: 'm4_FIXED', balance: 0, openingBalance: 0, code: '170000', isSystem: true },

    { userId, name: 'Cost of Sales', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '180000', isSystem: true },
    { userId, name: 'Administrative Expenses', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '190000', isSystem: true },
    { userId, name: 'Distribution Costs', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '200000', isSystem: true },
    { userId, name: 'Marketing Expenses', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '210000', isSystem: true },
    { userId, name: 'Finance Costs', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '220000', isSystem: true },
    { userId, name: 'Income Tax Expense', type: AccountType.EXPENSE, level: AccountLevel.GROUP, parentAccountId: 'm5_FIXED', balance: 0, openingBalance: 0, code: '230000', isSystem: true },
  ];

  const mainIdMap: Record<string, string> = {
    '1': `m1_${userId}`,
    '2': `m2_${userId}`,
    '3': `m3_${userId}`,
    '4': `m4_${userId}`,
    '5': `m5_${userId}`
  };

  for (const accData of defaultAccounts) {
    let finalId = '';
    let parentId = accData.parentAccountId;

    if (accData.level === AccountLevel.MAIN) {
      finalId = mainIdMap[accData.code];
    } else {
      finalId = `g_${accData.code}_${userId}`;
      if (parentId) {
        const mainCode = parentId.split('_')[0].replace('m', '');
        parentId = mainIdMap[mainCode];
      }
    }

    const account: Account = {
      ...accData,
      id: finalId,
      parentAccountId: parentId
    };
    store.put(account);
  }
};

export const getAllForUser = <T,>(storeName: string, userId: string, db: IDBDatabase): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index('userId');
    const request = index.getAll(userId);
    request.onsuccess = () => {
      console.log("DEBUG: DB initialized successfully");
      resolve(request.result);
    };
    request.onerror = () => {
      console.error("DEBUG: DB init error", request.error);
      reject(request.error);
    };
  });
};

export const getAll = <T,>(storeName: string, db: IDBDatabase): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveData = <T,>(storeName: string, data: T, db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const deleteData = (storeName: string, id: string, db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getOpeningBalancesForYear = (yearId: string, db: IDBDatabase): Promise<AccountYearData[]> => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('accountYearData', 'readonly');
    const store = transaction.objectStore('accountYearData');
    const index = store.index('yearId');
    const request = index.getAll(yearId);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
