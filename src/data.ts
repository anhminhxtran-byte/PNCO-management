export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  categoryId: string;
  amount: number;
  accountId: string;
  targetId: string; // customer or supplier id
  invoiceNo?: string;
  invoiceDate?: string;
  paidAmount: number;
  unpaidAmount: number;
  status: 'PAID' | 'UNPAID' | 'PARTIAL';
  notes?: string;
  personnelId?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  type?: 'CASH' | 'BANK';
  initialBalance?: number;
  bankName?: string;
  accountNumber?: string;
  icon?: string;
}

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Bán hàng', type: 'INCOME', icon: 'cart', color: '#10b981' },
  { id: 'c2', name: 'Dịch vụ', type: 'INCOME', icon: 'briefcase', color: '#10b981' },
  { id: 'c3', name: 'Vận chuyển', type: 'EXPENSE', icon: 'truck', color: '#ef4444' },
  { id: 'c4', name: 'Mặt bằng', type: 'EXPENSE', icon: 'home', color: '#ef4444' },
  { id: 'c5', name: 'Lương thưởng', type: 'EXPENSE', icon: 'users', color: '#ef4444' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    date: '2026-05-01',
    type: 'INCOME',
    categoryId: 'c1',
    amount: 15000000,
    accountId: 'a1',
    targetId: 'cus1',
    paidAmount: 15000000,
    unpaidAmount: 0,
    status: 'PAID',
    notes: 'Bán 10 laptop',
  },
  {
    id: 't2',
    date: '2026-05-02',
    type: 'EXPENSE',
    categoryId: 'c3',
    amount: 2000000,
    accountId: 'a1',
    targetId: 'sup1',
    paidAmount: 1000000,
    unpaidAmount: 1000000,
    status: 'PARTIAL',
    notes: 'Phí vận chuyển tháng',
  }
];

export const MOCK_ACCOUNTS: Account[] = [
  { id: 'a1', name: 'Tiền mặt', balance: 50000000, type: 'CASH', initialBalance: 50000000, icon: '💵' },
  { id: 'a2', name: 'Vietcombank', balance: 120000000, type: 'BANK', initialBalance: 120000000, bankName: 'Vietcombank', accountNumber: '0123456789', icon: '🏦' },
];

export interface Target {
  id: string;
  name: string;
  type: 'CUSTOMER' | 'SUPPLIER';
  phone?: string;
  email?: string;
  totalDebt: number;
}

export interface PersonnelData {
  id: string;
  name: string;
  username: string;
  role: string;
  permissions: string;
}

export const MOCK_TARGETS: Target[] = [
  { id: 'cus1', name: 'Nguyễn Văn A', type: 'CUSTOMER', phone: '0901234567', totalDebt: 0 },
  { id: 'cus2', name: 'Công ty ABC', type: 'CUSTOMER', phone: '0912345678', totalDebt: 5000000 },
  { id: 'sup1', name: 'Vận tải XYZ', type: 'SUPPLIER', phone: '0987654321', totalDebt: 1000000 },
];

export const MOCK_PERSONNEL: PersonnelData[] = [
  { id: 'p1', name: 'Admin', username: 'admin', role: 'Quản trị viên', permissions: 'Toàn quyền' },
  { id: 'p2', name: 'Nhân viên 1', username: 'nv1', role: 'Nhân viên', permissions: 'Xem, Thêm' },
];
