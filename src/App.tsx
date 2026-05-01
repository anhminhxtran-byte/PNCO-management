/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Transactions } from './views/Transactions';
import { Accounts } from './views/Accounts';
import { Categories } from './views/Categories';
import { Targets } from './views/Targets';
import { Personnel } from './views/Personnel';
import { GASSetup } from './views/GASSetup';

import { DataProvider } from './context/DataContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'accounts':
        return <Accounts />;
      case 'categories':
        return <Categories />;
      case 'customers':
        return <Targets type="CUSTOMER" />;
      case 'suppliers':
        return <Targets type="SUPPLIER" />;
      case 'personnel':
        return <Personnel />;
      case 'gas-setup':
        return <GASSetup />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50/50 font-sans text-gray-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-x-hidden p-8 bg-[#f8f9fc]">
          {renderContent()}
        </main>
      </div>
    </DataProvider>
  );
}
