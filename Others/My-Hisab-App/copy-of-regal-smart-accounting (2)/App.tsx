import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  ListTree, 
  BarChart3, 
  Settings, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Sparkles,
  Loader2,
  CheckCircle2,
  Search,
  ChevronRight,
  ShoppingCart,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  FileText,
  Hash,
  BookText,
  ChevronLeft,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Download,
  RefreshCw,
  Database,
  Moon,
  Sun,
  Mail,
  Phone,
  Globe,
  User as UserIcon,
  Building2,
  ExternalLink,
  HandCoins,
  Receipt,
  FolderOpen,
  ChevronDown,
  Fingerprint,
  FileSpreadsheet,
  FileJson,
  History,
  Calendar,
  Layers,
  Printer,
  Library,
  Eye,
  EyeOff,
  Upload,
  Filter,
  LogIn,
  ShieldCheck,
  Coins,
  ArrowRight,
  Lock,
  LogOut,
  CalendarDays,
  LockKeyhole,
  UnlockKeyhole
} from 'lucide-react';
import { 
  Account, 
  Transaction, 
  ViewType, 
  AccountType, 
  AccountLevel,
  JournalEntry,
  VoucherType,
  FinancialYear,
  User,
  AccountYearData
} from './types';
import { 
  initDB, 
  getAllForUser,
  saveData, 
  deleteData,
  seedDefaultAccounts,
  getOpeningBalancesForYear
} from './db';
import { 
  calculateBalances, 
  getFinancialSummary, 
  validateJournal,
  getNextVoucherNo
} from './engine';
import { getFinancialAdvice } from './services/gemini';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// --- Constants ---
const MUNNA_PHOTO_URL = "https://ui-avatars.com/api/?name=Regal+Professional&background=0b3c5d&color=fff&size=256";

// --- Components ---

const RegalLogoIcon = ({ size = 34 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
    <rect x="22" y="55" width="12" height="25" rx="2" fill="#3B82F6" />
    <rect x="44" y="40" width="12" height="40" rx="2" fill="#3B82F6" />
    <rect x="66" y="25" width="12" height="55" rx="2" fill="#3B82F6" />
    <path d="M15 70L85 25M85 25H68M85 25V42" stroke="#60A5FA" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StatCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; colorClass: string; isPrivate: boolean }> = ({ 
  title, amount, icon, colorClass, isPrivate 
}) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors text-left">
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl ${colorClass}`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</span>
    </div>
    <div className="text-xl font-black text-slate-800 dark:text-white transition-colors">
      {isPrivate ? '৳ ••••' : `৳${amount.toLocaleString()}`}
    </div>
  </div>
);

const ViewWrapper: React.FC<{ title: string; children: React.ReactNode; fabOffset?: boolean }> = ({ title, children, fabOffset = true }) => (
  <div className={`p-4 ${fabOffset ? 'pb-24' : 'pb-6'} max-w-lg mx-auto`}>
    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 transition-colors tracking-tight text-left">{title}</h2>
    {children}
  </div>
);

const NavButton: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ 
  active, icon, label, onClick
}) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center gap-1.5 transition-all relative ${active ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-300 dark:text-slate-600'}`}
  >
    {icon}
    <span className={`text-[8px] font-black uppercase tracking-[1.5px] ${active ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{label}</span>
    {active && <div className="absolute -top-1 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>}
  </button>
);

// --- Main App Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('AUTH');
  const [reportTab, setReportTab] = useState<'PL' | 'BS' | 'TB'>('PL');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financialYears, setFinancialYears] = useState<FinancialYear[]>([]);
  const [activeYear, setActiveYear] = useState<FinancialYear | null>(null);
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLedgerAccountId, setSelectedLedgerAccountId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [historyFilter, setHistoryFilter] = useState<VoucherType | 'ALL'>('ALL');
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [onboardingDates, setOnboardingDates] = useState({ 
    start: `${new Date().getFullYear()}-01-01`, 
    end: `${new Date().getFullYear()}-12-31` 
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [companyName, setCompanyName] = useState(() => localStorage.getItem('regal_company_name') || 'Regal Smart Accounting');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('regal_dark_mode') === 'true');

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Partial<Account> | null>(null);

  const [newTx, setNewTx] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    voucherType: 'JOURNAL' as VoucherType,
    voucherNo: '',
    debitAccount: '',
    creditAccount: '',
    amount: ''
  });

  const [newYearForm, setNewYearForm] = useState({
    label: '',
    startDate: '',
    endDate: '',
    carryForward: true
  });

  // Calculate filtered transactions based strictly on activeYearId
  const filteredTransactions = useMemo(() => {
    if (!activeYear) return [];
    return transactions.filter(tx => tx.yearId === activeYear.id);
  }, [transactions, activeYear]);

  // Accounts with balances rolled up and profit injected
  const accountsWithBalances = useMemo(() => {
    return calculateBalances(accounts, filteredTransactions);
  }, [accounts, filteredTransactions]);

  const financialSummary = useMemo(() => getFinancialSummary(accountsWithBalances), [accountsWithBalances]);

  useEffect(() => {
    const setup = async () => {
      try {
        const database = await initDB();
        setDb(database);
        
        const savedSession = localStorage.getItem('regal_user_session');
        if (savedSession) {
          const userData = JSON.parse(savedSession);
          setUser(userData);
          await loadUserData(userData, database);
        } else {
          setActiveView('AUTH');
        }
      } catch (error) {
        console.error("Setup failed", error);
      } finally {
        setIsInitializing(false);
      }
    };
    setup();
  }, []);

  const loadUserData = async (userData: User, database: IDBDatabase) => {
    const years = await getAllForUser<FinancialYear>('financialYears', userData.id, database);
    setFinancialYears(years);

    if (years.length === 0) {
      setActiveView('ONBOARDING');
      return;
    }

    // Determine active year
    const lastActiveYearId = localStorage.getItem(`active_year_${userData.id}`);
    const selectedYear = years.find(y => y.id === lastActiveYearId) || years[years.length - 1];
    await switchFinancialYear(selectedYear, userData, database);
  };

  const switchFinancialYear = async (year: FinancialYear, userData: User, database: IDBDatabase) => {
    setIsInitializing(true);
    setActiveYear(year);
    localStorage.setItem(`active_year_${userData.id}`, year.id);

    const userAccounts = await getAllForUser<Account>('accounts', userData.id, database);
    const openingBalances = await getOpeningBalancesForYear(year.id, database);
    const userTransactions = await getAllForUser<Transaction>('transactions', userData.id, database);

    // Map opening balances into account objects for engine consumption
    const hydratedAccounts = userAccounts.map(acc => {
      const yearData = openingBalances.find(ob => ob.accountId === acc.id);
      return {
        ...acc,
        openingBalance: yearData ? yearData.openingBalance : 0
      };
    });

    setAccounts(hydratedAccounts);
    setTransactions(userTransactions);
    setActiveView('DASHBOARD');
    setIsInitializing(false);
  };

  useEffect(() => {
    localStorage.setItem('regal_company_name', companyName);
  }, [companyName]);

  useEffect(() => {
    localStorage.setItem('regal_dark_mode', darkMode.toString());
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- Auth Handlers ---

  const handleGoogleLogin = () => {
    setIsInitializing(true);
    setTimeout(async () => {
      const mockUser: User = {
        id: 'google_user_' + Math.random().toString(36).substr(2, 9),
        email: 'user@gmail.com',
        name: 'Regal Professional',
        photoUrl: MUNNA_PHOTO_URL
      };
      setUser(mockUser);
      localStorage.setItem('regal_user_session', JSON.stringify(mockUser));
      if (db) await loadUserData(mockUser, db);
      setIsInitializing(false);
    }, 1000);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) return;
    setIsInitializing(true);
    setTimeout(async () => {
      const mockUser: User = {
        id: 'email_user_' + Math.random().toString(36).substr(2, 9),
        email: authEmail,
        name: authEmail.split('@')[0],
      };
      setUser(mockUser);
      localStorage.setItem('regal_user_session', JSON.stringify(mockUser));
      if (db) await loadUserData(mockUser, db);
      setIsInitializing(false);
    }, 1000);
  };

  const handleLogout = () => {
    if(confirm("Are you sure you want to log out? Offline sessions will be cleared.")) {
      localStorage.removeItem('regal_user_session');
      setUser(null);
      setAccounts([]);
      setTransactions([]);
      setFinancialYears([]);
      setActiveYear(null);
      setActiveView('AUTH');
    }
  };

  const handleCompleteOnboarding = async () => {
    if (!db || !user) return;
    setIsInitializing(true);
    try {
      const yearId = crypto.randomUUID();
      const newYear: FinancialYear = {
        id: yearId,
        userId: user.id,
        startDate: onboardingDates.start,
        endDate: onboardingDates.end,
        isLocked: false,
        label: `FY ${onboardingDates.start.split('-')[0]}-${onboardingDates.end.split('-')[0]}`
      };

      await saveData('financialYears', newYear, db);
      await seedDefaultAccounts(user.id, db);
      await loadUserData(user, db);
    } catch (e) {
      console.error(e);
    } finally {
      setIsInitializing(false);
    }
  };

  // --- Year Management ---

  const handleCreateNewYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    
    if (!newYearForm.startDate || !newYearForm.endDate || !newYearForm.label) {
      alert("Please fill all fields");
      return;
    }

    const yearId = crypto.randomUUID();
    const newYear: FinancialYear = {
      id: yearId,
      userId: user.id,
      startDate: newYearForm.startDate,
      endDate: newYearForm.endDate,
      isLocked: false,
      label: newYearForm.label
    };

    await saveData('financialYears', newYear, db);

    if (newYearForm.carryForward) {
      // Logic: Closing balance of current active year -> Opening balance of new year
      for (const acc of accountsWithBalances) {
        if (acc.level === AccountLevel.GL) {
          const yearData: AccountYearData = {
            id: `${acc.id}_${yearId}`,
            accountId: acc.id,
            yearId: yearId,
            userId: user.id,
            openingBalance: acc.balance
          };
          await saveData('accountYearData', yearData, db);
        }
      }
    }

    const updatedYears = await getAllForUser<FinancialYear>('financialYears', user.id, db);
    setFinancialYears(updatedYears);
    await switchFinancialYear(newYear, user, db);
    setNewYearForm({ label: '', startDate: '', endDate: '', carryForward: true });
  };

  const toggleYearLock = async (year: FinancialYear) => {
    if (!db) return;
    const msg = year.isLocked ? "Unlock this financial year for new entries?" : "Lock this financial year? No further edits or transactions will be permitted.";
    if (confirm(msg)) {
      const updated = { ...year, isLocked: !year.isLocked };
      await saveData('financialYears', updated, db);
      const years = await getAllForUser<FinancialYear>('financialYears', year.userId, db);
      setFinancialYears(years);
      if (activeYear?.id === year.id) setActiveYear(updated);
    }
  };

  // --- Logic Handlers ---

  const toggleGroup = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) newExpanded.delete(groupId);
    else newExpanded.add(groupId);
    setExpandedGroups(newExpanded);
  };

  const handleFetchAdvice = async () => {
    setIsAiLoading(true);
    const advice = await getFinancialAdvice(accountsWithBalances, filteredTransactions);
    setAiInsight(advice || null);
    setIsAiLoading(false);
  };

  const handleVoucherSelect = (type: VoucherType) => {
    let debit = '';
    let credit = '';
    const glAccounts = accountsWithBalances.filter(a => a.level === AccountLevel.GL);

    switch(type) {
      case 'SALES': 
        debit = glAccounts.find(a => a.name.toLowerCase().includes('receivable'))?.id || '';
        credit = glAccounts.find(a => a.name.toLowerCase().includes('sales') || a.name.toLowerCase().includes('revenue'))?.id || '';
        break;
      case 'PURCHASE':
        debit = glAccounts.find(a => a.name.toLowerCase().includes('cost of sales') || a.name.toLowerCase().includes('inventory'))?.id || '';
        credit = glAccounts.find(a => a.name.toLowerCase().includes('payable'))?.id || '';
        break;
      case 'RECEIPT':
        debit = glAccounts.find(a => a.name.toLowerCase().includes('cash'))?.id || '';
        credit = glAccounts.find(a => a.name.toLowerCase().includes('receivable'))?.id || '';
        break;
      case 'PAYMENT':
        debit = glAccounts.find(a => a.name.toLowerCase().includes('payable'))?.id || '';
        credit = glAccounts.find(a => a.name.toLowerCase().includes('cash'))?.id || '';
        break;
    }

    setNewTx(prev => ({ 
      ...prev, 
      voucherType: type,
      voucherNo: getNextVoucherNo(type, transactions),
      debitAccount: debit,
      creditAccount: credit
    }));
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user || !activeYear) return;

    if (activeYear.isLocked) {
      alert("This financial year is locked. No new transactions can be recorded.");
      return;
    }

    const amount = parseFloat(newTx.amount);
    if (isNaN(amount) || !newTx.debitAccount || !newTx.creditAccount) {
      alert("Please fill all fields");
      return;
    }

    if (newTx.debitAccount === newTx.creditAccount) {
      alert("Debit and Credit accounts must be different.");
      return;
    }

    const entries: JournalEntry[] = [
      { accountId: newTx.debitAccount, debit: amount, credit: 0 },
      { accountId: newTx.creditAccount, debit: 0, credit: amount }
    ];

    if (!validateJournal(entries)) {
      alert("Invalid Journal Entry. Debits must equal Credits.");
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      userId: user.id,
      yearId: activeYear.id,
      voucherNo: newTx.voucherNo || getNextVoucherNo(newTx.voucherType, transactions),
      date: newTx.date,
      description: newTx.description || `${newTx.voucherType} Voucher`,
      entries,
      voucherType: newTx.voucherType
    };

    await saveData('transactions', transaction, db);
    setTransactions(prev => [...prev, transaction]);
    setActiveView('DASHBOARD');
    setNewTx({
      date: new Date().toISOString().split('T')[0],
      description: '',
      voucherType: 'JOURNAL',
      voucherNo: '',
      debitAccount: '',
      creditAccount: '',
      amount: ''
    });
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!db || activeYear?.isLocked) return;
    if (confirm("Permanently delete this transaction? This will affect your account balances.")) {
      await deleteData('transactions', id, db);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !editingAccount || !user || !activeYear) return;

    if (!editingAccount.name || !editingAccount.parentAccountId) {
      alert("Please fill required details");
      return;
    }

    let finalCode = editingAccount.code || '';
    if (!editingAccount.id && editingAccount.level === AccountLevel.GL) {
      const parent = accounts.find(a => a.id === editingAccount.parentAccountId);
      if (parent) {
        const siblings = accounts.filter(a => a.parentAccountId === parent.id && a.level === AccountLevel.GL);
        const parentCodeNum = parseInt(parent.code);
        let maxSuffix = 0;
        siblings.forEach(s => {
          const suffix = parseInt(s.code) - parentCodeNum;
          if (suffix > maxSuffix) maxSuffix = suffix;
        });
        finalCode = (parentCodeNum + maxSuffix + 1).toString();
      }
    }

    const accountToSave: Account = {
      id: editingAccount.id || crypto.randomUUID(),
      userId: user.id,
      name: editingAccount.name,
      type: editingAccount.type as AccountType,
      level: editingAccount.level as AccountLevel,
      parentAccountId: editingAccount.parentAccountId,
      code: finalCode,
      balance: editingAccount.balance || 0,
      openingBalance: editingAccount.openingBalance || 0,
      isSystem: editingAccount.isSystem || false,
    };

    // 1. Save global account structure
    await saveData('accounts', accountToSave, db);
    
    // 2. Save opening balance specifically for THIS financial year
    const yearData: AccountYearData = {
      id: `${accountToSave.id}_${activeYear.id}`,
      accountId: accountToSave.id,
      yearId: activeYear.id,
      userId: user.id,
      openingBalance: accountToSave.openingBalance
    };
    await saveData('accountYearData', yearData, db);

    await switchFinancialYear(activeYear, user, db);
    setIsAccountModalOpen(false);
    setEditingAccount(null);
  };

  const handleDeleteAccount = async (id: string) => {
    if (!db || !user || !activeYear) return;
    const account = accountsWithBalances.find(a => a.id === id);
    if (!account) return;

    if (account.level !== AccountLevel.MAIN) {
      alert("Only General Ledger accounts can be deleted.");
      return;
    }

    if (Math.abs(account.balance) > 0.01) {
      alert(`Cannot delete account with balance.`);
      return;
    }

    const hasTransactions = transactions.some(tx => tx.entries.some(e => e.accountId === id));
    if (hasTransactions) {
      alert(`Cannot delete account with transaction history.`);
      return;
    }

    if (confirm(`Delete ledger account "${account.name}"?`)) {
      await deleteData('accounts', id, db);
      await switchFinancialYear(activeYear, user, db);
      setIsAccountModalOpen(false);
    }
  };

  const openAddAccount = () => {
    setEditingAccount({
      name: '',
      type: AccountType.ASSET,
      level: AccountLevel.GL,
      code: 'Auto-gen',
      openingBalance: 0,
      isSystem: false,
    });
    setIsAccountModalOpen(true);
  };

  const openEditAccount = (acc: Account) => {
    setEditingAccount(acc);
    setIsAccountModalOpen(true);
  };

  // --- Export Logic ---

  const handleExportCSV = (type: 'PL' | 'BS' | 'TB') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let filename = `Report_${type}_${activeYear?.label}_${new Date().toISOString().split('T')[0]}.csv`;
    // Existing logic...
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportReportPDF = (type: 'PL' | 'BS' | 'TB') => {
    const doc = new jsPDF();
    const margin = 10;
    let y = 20;

    doc.setFontSize(18);
    doc.text(companyName, margin, y);
    y += 10;

    doc.setFontSize(14);
    const reportTitle = type === 'PL' ? 'Profit & Loss Statement' : type === 'BS' ? 'Balance Sheet' : 'Trial Balance';
    doc.text(reportTitle, margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Financial Period: ${activeYear?.startDate} to ${activeYear?.endDate} (${activeYear?.label})`, margin, y);
    y += 5;
    doc.text(`Exported On: ${new Date().toLocaleDateString()}`, margin, y);
    y += 10;

    if (type === 'PL') {
      doc.setFont('helvetica', 'bold');
      doc.text("Description", margin, y);
      doc.text("Amount (৳)", 160, y);
      y += 5;
      doc.line(margin, y, 200, y);
      y += 10;

      doc.text("Total Revenue", margin, y);
      doc.text(financialSummary.totalSales.toLocaleString(), 160, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      accountsWithBalances.filter(a => a.type === AccountType.INCOME && a.level === AccountLevel.GROUP).forEach(a => {
        doc.text(`- ${a.name}`, margin + 5, y);
        doc.text(a.balance.toLocaleString(), 160, y);
        y += 7;
      });

      y += 5;
      doc.setFont('helvetica', 'bold');
      doc.text("Total Operational Expenses", margin, y);
      doc.text(financialSummary.totalExpenses.toLocaleString(), 160, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      accountsWithBalances.filter(a => a.type === AccountType.EXPENSE && a.level === AccountLevel.GROUP).forEach(a => {
        doc.text(`- ${a.name}`, margin + 5, y);
        doc.text(a.balance.toLocaleString(), 160, y);
        y += 7;
      });

      y += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text("Net Profit", margin, y);
      doc.text(financialSummary.netProfit.toLocaleString(), 160, y);
    } 
    else if (type === 'BS') {
      doc.setFont('helvetica', 'bold');
      doc.text("Description", margin, y);
      doc.text("Amount (৳)", 160, y);
      y += 5;
      doc.line(margin, y, 200, y);
      y += 10;

      doc.text("ASSETS", margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      accountsWithBalances.filter(a => a.type === AccountType.ASSET && a.level === AccountLevel.GROUP).map(a => (
        <div key={a.id}>
          {(() => {
            doc.text(a.name, margin + 5, y);
            doc.text(a.balance.toLocaleString(), 160, y);
            y += 7;
            return null;
          })()}
        </div>
      ));

      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text("LIABILITIES & EQUITY", margin, y);
      y += 7;
      doc.setFont('helvetica', 'normal');
      accountsWithBalances.filter(a => (a.type === AccountType.LIABILITY || a.type === AccountType.EQUITY) && a.level === AccountLevel.GROUP).map(a => (
        <div key={a.id}>
          {(() => {
            doc.text(a.name, margin + 5, y);
            doc.text(a.balance.toLocaleString(), 160, y);
            y += 7;
            return null;
          })()}
        </div>
      ));
    } 
    else if (type === 'TB') {
      doc.setFont('helvetica', 'bold');
      doc.text("Code", margin, y);
      doc.text("Account", margin + 20, y);
      doc.text("Debit (৳)", margin + 110, y);
      doc.text("Credit (৳)", margin + 150, y);
      y += 5;
      doc.line(margin, y, 200, y);
      y += 7;

      doc.setFont('helvetica', 'normal');
      accountsWithBalances.filter(a => a.level === AccountLevel.GL).forEach(acc => {
        if (y > 280) { doc.addPage(); y = 20; }
        const isDrType = acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE;
        doc.text(acc.code, margin, y);
        doc.text(acc.name.substring(0, 30), margin + 20, y);
        doc.text(isDrType ? acc.balance.toLocaleString() : '-', margin + 110, y);
        doc.text(!isDrType ? acc.balance.toLocaleString() : '-', margin + 150, y);
        y += 7;
      });
    }

    doc.save(`${reportTitle}_${activeYear?.label}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const hierarchyData = useMemo(() => {
    const mainAccounts = accountsWithBalances.filter(a => a.level === AccountLevel.MAIN);
    const groups = accountsWithBalances.filter(a => a.level === AccountLevel.GROUP);
    const gls = accountsWithBalances.filter(a => a.level === AccountLevel.GL && a.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return mainAccounts.map(main => ({
      ...main,
      children: groups
        .filter(g => g.parentAccountId === main.id)
        .map(group => ({
          ...group,
          children: gls.filter(gl => gl.parentAccountId === group.id)
        }))
    }));
  }, [accountsWithBalances, searchQuery]);

  const ledgerEntries = useMemo(() => {
    if (!selectedLedgerAccountId) return [];
    const account = accountsWithBalances.find(a => a.id === selectedLedgerAccountId);
    if (!account) return [];

    let runningBalance = account.openingBalance;
    const isAssetOrExpense = account.type === AccountType.ASSET || account.type === AccountType.EXPENSE;

    const entries = filteredTransactions
      .filter(tx => tx.entries.some(e => e.accountId === selectedLedgerAccountId))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(tx => {
        const entry = tx.entries.find(e => e.accountId === selectedLedgerAccountId)!;
        if (isAssetOrExpense) runningBalance += (entry.debit - entry.credit);
        else runningBalance += (entry.credit - entry.debit);
        return {
          txId: tx.id,
          date: tx.date,
          description: tx.description,
          voucherNo: tx.voucherNo,
          debit: entry.debit,
          credit: entry.credit,
          balance: runningBalance
        };
      });
      
    return entries.reverse();
  }, [selectedLedgerAccountId, filteredTransactions, accountsWithBalances]);

  const handleExportLedgerExcel = () => {
    if (!selectedLedgerAccountId) return;
    const account = accountsWithBalances.find(a => a.id === selectedLedgerAccountId);
    if (!account) return;

    const data = [
      { Date: '-', 'Voucher No': 'OPENING', Description: 'Opening Balance', Debit: 0, Credit: 0, Balance: account.openingBalance },
      ...[...ledgerEntries].reverse().map(e => ({
        Date: e.date, 'Voucher No': e.voucherNo, Description: e.description, Debit: e.debit, Credit: e.credit, Balance: e.balance
      }))
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
    XLSX.writeFile(workbook, `${account.name}_Ledger_${activeYear?.label}.xlsx`);
  };

  const handleExportLedgerPDF = () => {
    if (!selectedLedgerAccountId) return;
    const account = accountsWithBalances.find(a => a.id === selectedLedgerAccountId);
    if (!account) return;

    const doc = new jsPDF();
    const margin = 10;
    let y = 20;

    doc.setFontSize(18);
    doc.text(companyName, margin, y);
    y += 10;

    doc.setFontSize(14);
    doc.text(`Ledger Report: ${account.name}`, margin, y);
    y += 10;

    doc.setFontSize(10);
    doc.text(`Account Code: ${account.code} | Type: ${account.type}`, margin, y);
    y += 5;
    doc.text(`Financial Period: ${activeYear?.startDate} to ${activeYear?.endDate} (${activeYear?.label})`, margin, y);
    y += 5;
    doc.text(`Date Exported: ${new Date().toLocaleDateString()}`, margin, y);
    y += 10;

    // Table Headers
    doc.setFont('helvetica', 'bold');
    doc.text("Date", margin, y);
    doc.text("Voucher", margin + 25, y);
    doc.text("Description", margin + 50, y);
    doc.text("Dr.", margin + 110, y);
    doc.text("Cr.", margin + 140, y);
    doc.text("Balance", margin + 170, y);
    y += 5;
    doc.line(margin, y, 200, y);
    y += 7;

    doc.setFont('helvetica', 'bold');
    doc.text("-", margin, y);
    doc.text("OPENING", margin + 25, y);
    doc.text("Opening Balance", margin + 50, y);
    doc.text("0", margin + 110, y);
    doc.text("0", margin + 140, y);
    doc.text(account.openingBalance.toLocaleString(), margin + 170, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    [...ledgerEntries].reverse().forEach(e => {
      if (y > 275) { doc.addPage(); y = 20; }
      doc.text(e.date, margin, y);
      doc.text(e.voucherNo, margin + 25, y);
      doc.text(e.description.substring(0, 30), margin + 50, y);
      doc.text(e.debit.toLocaleString(), margin + 110, y);
      doc.text(e.credit.toLocaleString(), margin + 140, y);
      doc.text(e.balance.toLocaleString(), margin + 170, y);
      y += 7;
    });

    // --- Footer: Disclaimer and Page Numbering ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(150, 150, 150);
      
      const disclaimer = "This is a system generated ledger. No signature required for this.";
      const pageInfo = `Page ${i} of ${pageCount}`;
      
      // Draw disclaimer (left aligned)
      doc.text(disclaimer, margin, 287);
      // Draw page number (right aligned)
      doc.text(pageInfo, 200 - margin, 287, { align: 'right' });
    }

    doc.save(`${account.name}_Ledger_${activeYear?.label}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  /**
   * handleBackup: Exports all user-scoped data from IndexedDB into a JSON file for portability.
   */
  const handleBackup = async () => {
    if (!db || !user) return;
    try {
      const accountsData = await getAllForUser<Account>('accounts', user.id, db);
      const transactionsData = await getAllForUser<Transaction>('transactions', user.id, db);
      const yearsData = await getAllForUser<FinancialYear>('financialYears', user.id, db);
      const balancesData = await getAllForUser<AccountYearData>('accountYearData', user.id, db);

      const data = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        userId: user.id,
        accounts: accountsData,
        transactions: transactionsData,
        financialYears: yearsData,
        accountYearData: balancesData
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Regal_Accounting_Backup_${user.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Backup failed:", error);
      alert("Backup failed. See console for details.");
    }
  };

  /**
   * handleRestore: Processes a JSON backup file and restores the data into IndexedDB.
   */
  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !db || !user) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!data.accounts || !data.transactions || !data.financialYears) {
          alert("Invalid backup file: Essential data stores missing.");
          return;
        }

        if (confirm("Restore from file? This will merge/overwrite data for the current profile. It is recommended to have a backup of your current state first.")) {
          // Process accounts
          for (const acc of data.accounts) {
            await saveData('accounts', { ...acc, userId: user.id }, db);
          }
          // Process transactions
          for (const tx of data.transactions) {
            await saveData('transactions', { ...tx, userId: user.id }, db);
          }
          // Process financial years
          for (const fy of data.financialYears) {
            await saveData('financialYears', { ...fy, userId: user.id }, db);
          }
          // Process account year data (opening balances)
          if (data.accountYearData) {
            for (const ayd of data.accountYearData) {
              await saveData('accountYearData', { ...ayd, userId: user.id }, db);
            }
          }

          alert("Restore successful! Reloading your workspace...");
          await loadUserData(user, db);
          setActiveView('DASHBOARD');
        }
      } catch (error) {
        console.error("Restore error:", error);
        alert("Restore failed. Ensure the file is a valid Regal JSON backup.");
      }
    };
    reader.readAsText(file);
    // Reset the input so the same file can be selected again if needed
    event.target.value = '';
  };

  const getVoucherColor = (type: VoucherType) => {
    switch (type) {
      case 'SALES': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100 dark:border-emerald-800';
      case 'PURCHASE': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 border-rose-100 dark:border-rose-800';
      case 'RECEIPT': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-100 dark:border-blue-800';
      case 'PAYMENT': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100 dark:border-amber-800';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 border-slate-100 dark:border-slate-700';
    }
  };

  const getVoucherIcon = (type: VoucherType) => {
    switch (type) {
      case 'SALES': return <ShoppingCart size={16} />;
      case 'PURCHASE': return <ShoppingBag size={16} />;
      case 'RECEIPT': return <ArrowDownLeft size={16} />;
      case 'PAYMENT': return <ArrowUpRight size={16} />;
      default: return <FileText size={16} />;
    }
  };

  // --- Render Helpers ---

  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white flex-col space-y-4">
        <Loader2 className="animate-spin w-10 h-10 text-blue-400" />
        <p className="font-medium text-slate-400 uppercase tracking-widest text-[10px]">Securely Initializing...</p>
      </div>
    );
  }

  // --- Auth View ---
  if (activeView === 'AUTH') {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <RegalLogoIcon size={80} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Regal Accounting</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-[280px] mx-auto leading-relaxed">Secure, professional, and offline-first financial management for modern enterprises.</p>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            <span className="font-bold text-slate-700 dark:text-white">Continue with Google</span>
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or email</span>
            <div className="flex-1 h-[1px] bg-slate-100 dark:bg-slate-800"></div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3">
            <input 
              type="email" 
              placeholder="Email address" 
              value={authEmail}
              onChange={e => setAuthEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 p-4 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all dark:text-white"
            />
            <input 
              type="password" 
              placeholder="Secure password" 
              value={authPassword}
              onChange={e => setAuthPassword(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 p-4 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all dark:text-white"
            />
            <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-xl hover:bg-black transition-all">
              Log In to Workspace
            </button>
          </form>

          <p className="text-[10px] text-slate-400 font-medium pt-4">
            By signing in, you agree to our <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    );
  }

  // --- Onboarding View ---
  if (activeView === 'ONBOARDING') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col p-6 max-w-lg mx-auto transition-colors">
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Building2 size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Organization Setup</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Step {onboardingStep} of 2</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border dark:border-slate-700 space-y-6">
            {onboardingStep === 1 ? (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-5">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Company Identity</label>
                  <input 
                    type="text" 
                    placeholder="Enter Business Name" 
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold dark:text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Currency</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold dark:text-white">
                      <option>BDT (৳)</option>
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Tax Model</label>
                    <select className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 p-4 rounded-2xl text-sm font-bold dark:text-white">
                      <option>Standard VAT</option>
                      <option>GST (India)</option>
                      <option>None</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="animate-in slide-in-from-right-4 duration-500 space-y-5">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
                  <ShieldCheck size={20} className="text-blue-600" />
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Initial financial year will be defined now.</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Initial Financial Period</label>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="date" 
                      value={onboardingDates.start}
                      onChange={e => setOnboardingDates({...onboardingDates, start: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-xl text-xs font-bold dark:text-white"
                    />
                    <input 
                      type="date" 
                      value={onboardingDates.end}
                      onChange={e => setOnboardingDates({...onboardingDates, end: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 p-3 rounded-xl text-xs font-bold dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          {onboardingStep === 2 && (
            <button 
              onClick={() => setOnboardingStep(1)}
              className="flex-1 bg-white dark:bg-slate-800 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest text-slate-500 border shadow-sm"
            >
              Back
            </button>
          )}
          <button 
            onClick={() => onboardingStep === 1 ? setOnboardingStep(2) : handleCompleteOnboarding()}
            className="flex-[2] bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2"
          >
            {onboardingStep === 1 ? 'Continue Setup' : 'Complete Registration'}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // --- Main Application View ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col transition-colors">
      <header className="sticky top-0 z-20 bg-slate-900 dark:bg-black text-white px-4 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <RegalLogoIcon />
          <div className="ml-1 text-left">
            <h1 className="text-sm font-bold leading-none tracking-tight">{companyName}</h1>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-1">
              {activeYear ? `${activeYear.label} • ${activeYear.isLocked ? 'Locked' : 'Active'}` : 'Loading...'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsPrivateMode(!isPrivateMode)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400" title="Private Mode">
            {isPrivateMode ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button onClick={handleFetchAdvice} className="p-2 hover:bg-white/10 rounded-full transition-colors text-blue-400" title="AI Insight">
            <Sparkles size={20} />
          </button>
          <button onClick={() => setActiveView('YEAR_MGMT')} className={`p-2 rounded-full transition-colors ${activeView === 'YEAR_MGMT' ? 'bg-white/20' : 'hover:bg-white/10 text-slate-400'}`} title="Financial Years">
            <CalendarDays size={20} />
          </button>
          <button onClick={() => setActiveView('SETTINGS')} className={`p-2 rounded-full transition-colors ${activeView === 'SETTINGS' ? 'bg-white/20' : 'hover:bg-white/10 text-slate-400'}`} title="Settings">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {isAccountModalOpen && editingAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-5 flex justify-between items-center border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {editingAccount.level === AccountLevel.GL ? <Hash size={16} className="text-emerald-500" /> : <FolderOpen size={16} className="text-blue-500" />}
                {editingAccount.id ? `Edit Account` : 'New Ledger Account'}
              </h3>
              <button onClick={() => setIsAccountModalOpen(false)} className="text-slate-400"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveAccount} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="text-left">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Account Name</label>
                <input type="text" readOnly={editingAccount.level === AccountLevel.MAIN} value={editingAccount.name || ''} onChange={e => setEditingAccount({...editingAccount, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm dark:text-white outline-none focus:border-blue-500" />
              </div>
              {editingAccount.level === AccountLevel.GL && (
                <div className="text-left">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Group Summary Account</label>
                  <select 
                    value={editingAccount.parentAccountId || ''} 
                    onChange={e => {
                      const parent = accounts.find(a => a.id === e.target.value);
                      setEditingAccount({...editingAccount, parentAccountId: e.target.value, type: parent?.type});
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm dark:text-white outline-none focus:border-blue-500"
                  >
                    <option value="">Select a Group...</option>
                    {accounts.filter(a => a.level === AccountLevel.GROUP).sort((a,b) => a.code.localeCompare(b.code)).map(g => (
                      <option key={g.id} value={g.id}>{g.name} ({g.code})</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 text-left">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Account Code</label>
                  <input type="text" readOnly value={editingAccount.code || ''} className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm dark:text-slate-400 outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">Opening Balance</label>
                  <input type="number" value={editingAccount.openingBalance || 0} onChange={e => setEditingAccount({...editingAccount, openingBalance: parseFloat(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm dark:text-white outline-none" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                {editingAccount.id && editingAccount.level === AccountLevel.GL && (
                  <button type="button" onClick={() => handleDeleteAccount(editingAccount.id!)} className="p-4 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all"><Trash2 size={20} /></button>
                )}
                {editingAccount.level !== AccountLevel.MAIN && (
                  <button type="submit" className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-xl">Save Changes</button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-24">
        {activeView === 'DASHBOARD' && (
          <ViewWrapper title="Pulse Dashboard">
            <div className="grid grid-cols-2 gap-3 mb-6">
              <StatCard title="Sales" amount={financialSummary.totalSales} icon={<TrendingUp className="text-emerald-600" size={20} />} colorClass="bg-emerald-100/50" isPrivate={isPrivateMode} />
              <StatCard title="Purchase" amount={financialSummary.totalPurchases} icon={<Receipt className="text-rose-600" size={20} />} colorClass="bg-rose-100/50" isPrivate={isPrivateMode} />
              <StatCard title="Cash Balance" amount={financialSummary.cashBalance} icon={<Wallet className="text-blue-600" size={20} />} colorClass="bg-blue-100/50" isPrivate={isPrivateMode} />
              <StatCard title="Receivable" amount={financialSummary.receivables} icon={<HandCoins className="text-indigo-600" size={20} />} colorClass="bg-indigo-100/50" isPrivate={isPrivateMode} />
              <StatCard title="Payable" amount={financialSummary.payables} icon={<ShoppingCart className="text-amber-600" size={20} />} colorClass="bg-amber-100/50" isPrivate={isPrivateMode} />
              <StatCard title="Profit / Loss" amount={financialSummary.netProfit} icon={<CheckCircle2 className="text-emerald-600" size={20} />} colorClass="bg-emerald-100/50" isPrivate={isPrivateMode} />
            </div>

            {(aiInsight || isAiLoading) && (
              <div className="mb-8 bg-gradient-to-br from-blue-700 to-indigo-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={80} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span className="text-[10px] font-black uppercase tracking-[2px] text-blue-200">AI Financial Review</span>
                  </div>
                  {isAiLoading ? (
                    <div className="flex items-center gap-3 py-2">
                      <Loader2 className="animate-spin text-blue-300" size={20} />
                      <p className="text-sm font-medium animate-pulse">Scanning ledgers...</p>
                    </div>
                  ) : (<p className="text-sm leading-relaxed text-blue-50 font-medium">"{aiInsight}"</p>)}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-700 dark:text-slate-300">Quick Journal</h3>
              <button onClick={() => setActiveView('TRANSACTIONS')} className="text-xs font-bold text-blue-600">Explore All</button>
            </div>
            
            <div className="space-y-3">
              {filteredTransactions.slice(-5).reverse().map(tx => (
                <div key={tx.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getVoucherColor(tx.voucherType)}`}>
                      {getVoucherIcon(tx.voucherType)}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-sm text-slate-800 dark:text-white">{tx.description}</div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{tx.voucherNo} • {tx.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900 dark:text-white transition-colors">
                      {isPrivateMode ? '৳ ••••' : `৳${(tx.entries[0].debit || tx.entries[0].credit).toLocaleString()}`}
                    </div>
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && <div className="p-10 text-center text-slate-400 italic text-sm">No activity recorded for this period.</div>}
            </div>
          </ViewWrapper>
        )}

        {activeView === 'CHART' && (
          <ViewWrapper title="Chart of Accounts">
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search accounts..." className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 dark:text-white rounded-2xl shadow-sm text-sm outline-none focus:ring-2 focus:ring-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <button onClick={openAddAccount} className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg active:scale-95 transition-all"><Plus size={24} /></button>
            </div>
            <div className="space-y-6 text-left">
              {hierarchyData.map(main => (
                <div key={main.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <Layers size={16} className="text-blue-600" />
                    <h3 className="text-xs font-black text-slate-900 dark:text-slate-100 uppercase tracking-[2px]">{main.name}</h3>
                  </div>
                  <div className="space-y-3">
                    {main.children.map(group => (
                      <div key={group.id} className="bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-sm border dark:border-slate-700 overflow-hidden">
                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" onClick={() => toggleGroup(group.id)}>
                          <div className="flex items-center gap-3">
                            <ChevronDown size={14} className={`text-slate-400 transition-transform ${expandedGroups.has(group.id) ? 'rotate-180' : ''}`} />
                            <div>
                              <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                                {group.name}
                                <button onClick={(e) => { e.stopPropagation(); openEditAccount(group); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-600 rounded text-slate-400"><Edit2 size={10} /></button>
                              </div>
                              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Code: {group.code}</div>
                            </div>
                          </div>
                          <div className="text-sm font-black text-slate-900 dark:text-white transition-colors">৳{group.balance.toLocaleString()}</div>
                        </div>
                        {expandedGroups.has(group.id) && (
                          <div className="bg-slate-50 dark:bg-slate-900 divide-y dark:divide-slate-800 animate-in slide-in-from-top-1">
                            {group.children.map(gl => (
                              <div key={gl.id} className="flex items-center justify-between p-3 px-8 cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors group" onClick={() => openEditAccount(gl)}>
                                <div className="flex items-center gap-4">
                                  <div className="text-[10px] font-black text-slate-400 w-12">{gl.code}</div>
                                  <div className="font-medium text-xs text-slate-700 dark:text-slate-300">{gl.name}</div>
                                </div>
                                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">৳{gl.balance.toLocaleString()}</div>
                              </div>
                            ))}
                            <div className="p-3 px-8 text-[10px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline" onClick={() => {
                              setEditingAccount({ name: '', type: group.type, level: AccountLevel.GL, parentAccountId: group.id, openingBalance: 0, code: 'Auto-gen' });
                              setIsAccountModalOpen(true);
                            }}><Plus size={10} /> Create New Ledger</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ViewWrapper>
        )}

        {activeView === 'YEAR_MGMT' && (
          <ViewWrapper title="Financial Periods">
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-700 text-left">
                <h3 className="font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase text-xs tracking-widest"><CalendarDays size={18} className="text-blue-600" /> Existing Periods</h3>
                <div className="space-y-3">
                  {financialYears.map(year => (
                    <div key={year.id} className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${activeYear?.id === year.id ? 'border-blue-500 bg-blue-50/10' : 'border-slate-100 dark:border-slate-700'}`}>
                      <div className="flex-1 cursor-pointer" onClick={() => user && db && switchFinancialYear(year, user, db)}>
                        <h4 className="font-black text-sm dark:text-white">{year.label} {activeYear?.id === year.id && <span className="text-[8px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase ml-2">Active</span>}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{year.startDate} to {year.endDate}</p>
                      </div>
                      <button onClick={() => toggleYearLock(year)} className={`p-3 rounded-xl transition-colors ${year.isLocked ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400 hover:text-blue-600'}`}>
                        {year.isLocked ? <LockKeyhole size={16} /> : <UnlockKeyhole size={16} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-700 text-left">
                <h3 className="font-black text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase text-xs tracking-widest"><Plus size={18} className="text-emerald-600" /> Create New Year</h3>
                <form onSubmit={handleCreateNewYear} className="space-y-4">
                   <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Year Label (e.g. FY 2026-27)</label>
                    <input type="text" placeholder="FY 2026-27" value={newYearForm.label} onChange={e => setNewYearForm({...newYearForm, label: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold dark:text-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Start Date</label>
                      <input type="date" value={newYearForm.startDate} onChange={e => setNewYearForm({...newYearForm, startDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold dark:text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">End Date</label>
                      <input type="date" value={newYearForm.endDate} onChange={e => setNewYearForm({...newYearForm, endDate: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-xs font-bold dark:text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2">
                    <input type="checkbox" id="carryForward" checked={newYearForm.carryForward} onChange={e => setNewYearForm({...newYearForm, carryForward: e.target.checked})} className="w-4 h-4" />
                    <label htmlFor="carryForward" className="text-sm font-bold dark:text-white">Carry forward closing balances?</label>
                  </div>
                  <button type="submit" className="w-full bg-slate-900 dark:bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Initialize New Year</button>
                </form>
              </div>
            </div>
          </ViewWrapper>
        )}

        {activeView === 'SETTINGS' && (
          <ViewWrapper title="System Configuration">
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-700 text-left">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-800 dark:text-white flex items-center gap-2"><UserIcon size={20} className="text-blue-600" /> Account Owner</h3>
                  <button onClick={handleLogout} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><LogOut size={18} /></button>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border dark:border-slate-700">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                    <img src={user?.photoUrl || MUNNA_PHOTO_URL} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white leading-tight">{user?.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-emerald-600 text-[10px] font-bold uppercase">
                      <ShieldCheck size={12} /> Pro Verified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-700 text-left">
                <h3 className="font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 transition-colors"><Building2 size={20} className="text-emerald-600" /> Organization Profile</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Brand Name</label>
                    <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold dark:text-white outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-2 mt-2">
                    <div className="flex items-center gap-3">
                      {darkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-amber-500" />}
                      <span className="text-sm font-bold dark:text-white">Interface Mode: {darkMode ? 'Dark' : 'Light'}</span>
                    </div>
                    <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full relative transition-colors ${darkMode ? 'bg-blue-600' : 'bg-slate-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border dark:border-slate-700 text-left">
                <h3 className="font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Database size={20} className="text-emerald-600" /> Maintenance</h3>
                <div className="space-y-3">
                  <button onClick={handleBackup} className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border flex items-center justify-center gap-2 transition-colors">
                    <Download size={16} /> Export Cloud Backup
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border flex items-center justify-center gap-2 transition-colors">
                    <Upload size={16} /> Restore from File
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleRestore} />
                </div>
              </div>
            </div>
          </ViewWrapper>
        )}

        {activeView === 'TRANSACTIONS' && (
          <ViewWrapper title="Transaction Audit">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {(['ALL', 'SALES', 'PURCHASE', 'RECEIPT', 'PAYMENT', 'JOURNAL'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setHistoryFilter(type)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${historyFilter === type ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {[...filteredTransactions].reverse().map(tx => (
                <div key={tx.id} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border dark:border-slate-700 transition-colors group relative text-left">
                  {(!activeYear?.isLocked) && (
                    <button 
                      onClick={() => handleDeleteTransaction(tx.id)}
                      className="absolute top-4 right-4 p-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  <div className="flex justify-between items-start mb-4 pr-8">
                    <div className="flex items-center gap-3">
                       <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center ${getVoucherColor(tx.voucherType)}`}>
                        {getVoucherIcon(tx.voucherType)}
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tx.voucherType} • {tx.voucherNo}</div>
                        <h4 className="font-black text-slate-900 dark:text-white mt-0.5">{tx.description}</h4>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg dark:text-white leading-none">৳{(tx.entries[0].debit || tx.entries[0].credit).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{tx.date}</div>
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-3 space-y-2 transition-colors">
                    {tx.entries.map((e, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-500 italic">{e.debit > 0 ? 'Dr.' : 'Cr.'} {accountsWithBalances.find(a => a.id === e.accountId)?.name}</span>
                        <span className="dark:text-white font-black">৳{(e.debit || e.credit).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {filteredTransactions.length === 0 && <div className="p-10 text-center text-slate-400 italic text-sm">No transactions found for {activeYear?.label}.</div>}
            </div>
          </ViewWrapper>
        )}

        {activeView === 'ADD_TRANSACTION' && (
          <ViewWrapper title="Authorize Voucher" fabOffset={false}>
            <div className="grid grid-cols-5 gap-1.5 mb-6 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-sm border dark:border-slate-700">
              {(['SALES', 'PURCHASE', 'RECEIPT', 'PAYMENT', 'JOURNAL'] as VoucherType[]).map(type => (
                <button key={type} onClick={() => handleVoucherSelect(type)} className={`py-3 px-1 flex flex-col items-center gap-2 rounded-2xl transition-all ${newTx.voucherType === type ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-xl scale-105' : 'text-slate-400'}`}>
                  {getVoucherIcon(type)}
                  <span className="text-[7px] font-black uppercase tracking-tighter">{type}</span>
                </button>
              ))}
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border dark:border-slate-700 space-y-5 transition-colors text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Posting Date</label>
                    <input type="date" value={newTx.date} onChange={e => setNewTx(p => ({ ...p, date: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-bold dark:text-white" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Serial UID</label>
                    <div className="relative">
                      <input type="text" value={newTx.voucherNo} readOnly className="w-full bg-slate-100 dark:bg-slate-700 border-2 border-slate-100 dark:border-slate-700 rounded-2xl p-4 text-sm font-black text-slate-500 dark:text-slate-400" placeholder="Auto-gen" />
                      <Fingerprint size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monetary Value (৳)</label>
                  <input type="number" placeholder="0.00" value={newTx.amount} onChange={e => setNewTx(p => ({ ...p, amount: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl p-4 text-sm font-black dark:text-white outline-none focus:border-blue-500" />
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Debit Entry (Target GL)</label>
                    <select value={newTx.debitAccount} onChange={e => setNewTx(p => ({ ...p, debitAccount: e.target.value }))} className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${newTx.debitAccount && newTx.debitAccount === newTx.creditAccount ? 'border-rose-300' : 'border-slate-50 dark:border-slate-800'} rounded-2xl p-4 text-sm font-bold dark:text-white transition-all`}>
                      <option value="">Select Target...</option>
                      {accountsWithBalances.filter(a => a.level === AccountLevel.GL).map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credit Entry (Source GL)</label>
                    <select value={newTx.creditAccount} onChange={e => setNewTx(p => ({ ...p, creditAccount: e.target.value }))} className={`w-full bg-slate-50 dark:bg-slate-900 border-2 ${newTx.debitAccount && newTx.debitAccount === newTx.creditAccount ? 'border-rose-300' : 'border-slate-50 dark:border-slate-800'} rounded-2xl p-4 text-sm font-bold dark:text-white transition-all`}>
                      <option value="">Select Source...</option>
                      {accountsWithBalances.filter(a => a.level === AccountLevel.GL).map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setActiveView('DASHBOARD')} className="flex-1 bg-white dark:bg-slate-800 dark:text-white py-5 rounded-[2rem] font-black text-xs uppercase shadow-sm border transition-colors">Discard</button>
                <button type="submit" disabled={newTx.debitAccount === newTx.creditAccount || activeYear?.isLocked} className={`flex-[2] ${newTx.debitAccount === newTx.creditAccount || activeYear?.isLocked ? 'bg-slate-300 opacity-50 cursor-not-allowed' : 'bg-slate-900 dark:bg-blue-600'} text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 transition-all`}>
                  <CheckCircle2 size={18} /> Confirm Entry
                </button>
              </div>
            </form>
          </ViewWrapper>
        )}

        {activeView === 'LEDGER' && (
          <ViewWrapper title={selectedLedgerAccountId ? "GL Audit" : "Ledger Catalog"}>
            {!selectedLedgerAccountId ? (
              <div className="space-y-3">
                {accountsWithBalances.filter(a => a.level === AccountLevel.GL).map(acc => (
                  <button key={acc.id} onClick={() => setSelectedLedgerAccountId(acc.id)} className="w-full bg-white dark:bg-slate-800 p-5 rounded-3xl flex items-center justify-between shadow-sm border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900 transition-all text-left">
                    <div>
                      <div className="font-black text-sm text-slate-800 dark:text-white flex items-center gap-1.5 leading-none transition-colors">
                        {acc.name}
                      </div>
                      <div className="text-[9px] text-slate-400 font-black uppercase tracking-[1.5px] mt-1.5">{acc.type} • {acc.code}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight transition-colors">৳{acc.balance.toLocaleString()}</div>
                      <ChevronRight size={18} className="text-slate-200 dark:text-slate-600" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
                <div className="flex justify-between items-center mb-2">
                  <button onClick={() => setSelectedLedgerAccountId(null)} className="flex items-center gap-1 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest"><ChevronLeft size={16} /> All Ledgers</button>
                  <div className="flex gap-2">
                    <button onClick={handleExportLedgerExcel} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm flex items-center gap-2 text-[10px] font-black uppercase transition-all hover:bg-emerald-100">
                      <FileSpreadsheet size={14} /> XLSX
                    </button>
                    <button onClick={handleExportLedgerPDF} className="p-2 bg-rose-50 text-rose-600 rounded-xl shadow-sm flex items-center gap-2 text-[10px] font-black uppercase transition-all hover:bg-rose-100">
                      <Printer size={14} /> PDF
                    </button>
                  </div>
                </div>
                <div className="bg-slate-900 dark:bg-blue-600 p-6 rounded-[2rem] shadow-xl text-white relative overflow-hidden transition-colors">
                  <div className="absolute top-0 right-0 p-6 opacity-10"><BookText size={100} /></div>
                  <div className="relative z-10 flex justify-between items-end">
                    <div>
                      <h3 className="text-xl font-black">{accountsWithBalances.find(a => a.id === selectedLedgerAccountId)?.name}</h3>
                      <p className="text-[10px] text-blue-400 dark:text-blue-100 font-bold uppercase tracking-[2px] mt-1">Ref Code: {accountsWithBalances.find(a => a.id === selectedLedgerAccountId)?.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 dark:text-blue-200 font-black uppercase tracking-widest mb-1 transition-colors">Closing Balance</p>
                      <div className="text-2xl font-black text-blue-400 dark:text-white tracking-tighter transition-colors">৳{accountsWithBalances.find(a => a.id === selectedLedgerAccountId)?.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl text-[10px] font-black text-slate-400 uppercase border border-dashed text-center">Opening Balance: ৳{accountsWithBalances.find(a => a.id === selectedLedgerAccountId)?.openingBalance.toLocaleString()}</div>
                  {ledgerEntries.map((entry, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center transition-colors group">
                      <div className="flex-1">
                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">{entry.date} • {entry.voucherNo}</div>
                        <div className="font-bold text-sm text-slate-800 dark:text-white mt-0.5 transition-colors">{entry.description}</div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex gap-4 justify-end items-center mb-1">
                          {entry.debit > 0 && <p className="text-xs font-black text-blue-600 dark:text-blue-400">Dr: {entry.debit.toLocaleString()}</p>}
                          {entry.credit > 0 && <p className="text-xs font-black text-rose-600 dark:text-rose-400">Cr: {entry.credit.toLocaleString()}</p>}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-tight">Bal: ৳{entry.balance.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ViewWrapper>
        )}

        {activeView === 'REPORTS' && (
          <ViewWrapper title="Business Insight">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[1.5rem] mb-6 transition-colors shadow-inner">
              <button onClick={() => setReportTab('PL')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${reportTab === 'PL' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Income Stmt</button>
              <button onClick={() => setReportTab('BS')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${reportTab === 'BS' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Bal Sheet</button>
              <button onClick={() => setReportTab('TB')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${reportTab === 'TB' ? 'bg-white dark:bg-slate-700 shadow-lg text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>Trial Bal</button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] shadow-xl border dark:border-slate-700 min-h-[400px] transition-colors relative">
               <div className="flex justify-end gap-2 mb-4">
                  <button onClick={() => handleExportReportPDF(reportTab)} className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 hover:text-rose-600 transition-colors shadow-sm" title="Export PDF"><Printer size={16} /></button>
                </div>
              {reportTab === 'PL' && (
                <div className="space-y-6 animate-in fade-in duration-500 text-left">
                  <div className="space-y-4">
                    <div className="flex justify-between font-black text-sm text-slate-800 dark:text-white border-b pb-2">
                      <span>Gross Revenue</span>
                      <span className="text-emerald-600">৳{financialSummary.totalSales.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-black text-sm text-slate-800 dark:text-white border-b pb-2 pt-4">
                      <span>Total Expenses</span>
                      <span className="text-rose-600">৳{financialSummary.totalExpenses.toLocaleString()}</span>
                    </div>
                    <div className="pt-8">
                      <div className="flex justify-between font-black text-2xl text-slate-900 dark:text-white border-t-4 border-slate-900 dark:border-blue-600 pt-4">
                        <span>Net Profit</span>
                        <span className={financialSummary.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          ৳{financialSummary.netProfit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {reportTab === 'BS' && (
                 <div className="space-y-6 animate-in fade-in duration-500 text-left">
                  <div className="space-y-4">
                    <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                       <h5 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Assets</h5>
                       <div className="space-y-2">
                        {accountsWithBalances.filter(a => a.type === AccountType.ASSET && a.level === AccountLevel.GROUP).map(a => (
                          <div key={a.id} className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>{a.name}</span>
                            <span>৳{a.balance.toLocaleString()}</span>
                          </div>
                        ))}
                       </div>
                    </div>
                    <div className="bg-rose-50/50 dark:bg-rose-900/10 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                       <h5 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3">Equity & Liabilities</h5>
                       <div className="space-y-2">
                        {accountsWithBalances.filter(a => (a.type === AccountType.LIABILITY || a.type === AccountType.EQUITY) && a.level === AccountLevel.GROUP).map(a => (
                          <div key={a.id} className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span>{a.name}</span>
                            <span>৳{a.balance.toLocaleString()}</span>
                          </div>
                        ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}
              {reportTab === 'TB' && (
                <div className="space-y-4 animate-in fade-in duration-500 text-left">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    {accountsWithBalances.filter(a => a.level === AccountLevel.GL).map(acc => (
                        <div key={acc.id} className="flex justify-between text-[11px] font-bold border-b dark:border-slate-800 pb-2">
                          <span className="text-slate-500 dark:text-slate-400">{acc.name}</span>
                          <div className="flex gap-4">
                            <span className="w-20 text-right text-blue-600 dark:text-blue-400 font-black">{acc.type === AccountType.ASSET || acc.type === AccountType.EXPENSE ? acc.balance.toLocaleString() : '-'}</span>
                            <span className="w-20 text-right text-rose-600 dark:text-rose-400 font-black">{acc.type !== AccountType.ASSET && acc.type !== AccountType.EXPENSE ? acc.balance.toLocaleString() : '-'}</span>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ViewWrapper>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t dark:border-slate-800 px-3 py-4 flex justify-around items-center z-40 shadow-2xl transition-colors">
        <NavButton active={activeView === 'DASHBOARD'} onClick={() => setActiveView('DASHBOARD')} icon={<LayoutDashboard size={22} />} label="Home" />
        <NavButton active={activeView === 'TRANSACTIONS'} onClick={() => setActiveView('TRANSACTIONS')} icon={<ClipboardList size={22} />} label="Transactions" />
        <NavButton active={activeView === 'LEDGER'} onClick={() => { setActiveView('LEDGER'); setSelectedLedgerAccountId(null); }} icon={<Library size={22} />} label="Ledgers" />
        <NavButton active={activeView === 'CHART'} onClick={() => setActiveView('CHART')} icon={<ListTree size={22} />} label="COA" />
        <NavButton active={activeView === 'REPORTS'} onClick={() => setActiveView('REPORTS')} icon={<BarChart3 size={22} />} label="Reports" />
      </nav>

      {activeView !== 'ADD_TRANSACTION' && (
        <button onClick={() => setActiveView('ADD_TRANSACTION')} className={`fixed bottom-24 right-6 w-14 h-14 ${activeYear?.isLocked ? 'bg-slate-300 cursor-not-allowed opacity-50' : 'bg-slate-900 dark:bg-blue-600'} text-white rounded-[1.5rem] shadow-2xl flex items-center justify-center active:scale-90 transition-all z-30 ring-4 ring-white dark:ring-slate-900`}>
          <Plus size={28} />
        </button>
      )}
    </div>
  );
};

export default App;
