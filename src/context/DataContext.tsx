import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  MOCK_CATEGORIES, 
  MOCK_TRANSACTIONS, 
  MOCK_ACCOUNTS, 
  MOCK_TARGETS, 
  MOCK_PERSONNEL, 
  Category, 
  Transaction, 
  Account, 
  Target, 
  PersonnelData 
} from '../data';

interface DataContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  targets: Target[];
  setTargets: React.Dispatch<React.SetStateAction<Target[]>>;
  personnelList: PersonnelData[];
  setPersonnelList: React.Dispatch<React.SetStateAction<PersonnelData[]>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [targets, setTargets] = useState<Target[]>(MOCK_TARGETS);
  const [personnelList, setPersonnelList] = useState<PersonnelData[]>(MOCK_PERSONNEL);

  return (
    <DataContext.Provider value={{
      categories, setCategories,
      transactions, setTransactions,
      accounts, setAccounts,
      targets, setTargets,
      personnelList, setPersonnelList
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
