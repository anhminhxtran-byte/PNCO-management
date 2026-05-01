import { Plus, X, Building2, Wallet, Pencil, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { formatCurrency } from '../lib/utils';
import { useState } from 'react';
import { Account } from '../data';
import { ConfirmModal } from '../components/ConfirmModal';
import { useData } from '../context/DataContext';

const ICONS = ['💰', '💵', '💳', '🏦', '💸', '💲', '💎', '🏛️'];

export function Accounts() {
  const { accounts, setAccounts } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'CASH' as 'CASH' | 'BANK',
    initialBalance: '',
    bankName: '',
    accountNumber: '',
    icon: '💰'
  });

  const totalInitial = accounts.reduce((sum, acc) => sum + (acc.initialBalance || 0), 0);
  const totalCurrent = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const handleOpenAdd = () => {
    setEditingAccountId(null);
    setFormData({
      name: '',
      type: 'CASH',
      initialBalance: '',
      bankName: '',
      accountNumber: '',
      icon: '💰'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: Account) => {
    setEditingAccountId(acc.id);
    setFormData({
      name: acc.name,
      type: acc.type || 'CASH',
      initialBalance: acc.initialBalance !== undefined ? String(acc.initialBalance) : '',
      bankName: acc.bankName || '',
      accountNumber: acc.accountNumber || '',
      icon: acc.icon || '💰'
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setAccounts(accounts.filter(a => a.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.initialBalance || !formData.icon) {
      alert('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    if (editingAccountId) {
      // Edit mode
      setAccounts(accounts.map(acc => {
        if (acc.id === editingAccountId) {
          const oldInitialBalance = acc.initialBalance || 0;
          const newInitialBalance = Number(formData.initialBalance);
          const balanceDifference = newInitialBalance - oldInitialBalance;
          
          return {
            ...acc,
            name: formData.name,
            type: formData.type,
            initialBalance: newInitialBalance,
            balance: acc.balance + balanceDifference,
            bankName: formData.type === 'BANK' ? formData.bankName : undefined,
            accountNumber: formData.type === 'BANK' ? formData.accountNumber : undefined,
            icon: formData.icon
          };
        }
        return acc;
      }));
    } else {
      // Add mode
      const newAccount: Account = {
        id: `a${Date.now()}`,
        name: formData.name,
        type: formData.type,
        initialBalance: Number(formData.initialBalance),
        balance: Number(formData.initialBalance), // balance is initially the initial balance
        bankName: formData.type === 'BANK' ? formData.bankName : undefined,
        accountNumber: formData.type === 'BANK' ? formData.accountNumber : undefined,
        icon: formData.icon
      };
      setAccounts([...accounts, newAccount]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <Header 
        title="Quản lý tài khoản"
        actions={
          <button 
            onClick={handleOpenAdd}
            className="flex items-center px-4 py-2 bg-[#194b8e] text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm tài khoản
          </button>
        }
      />

      <div className="flex gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between flex-1 relative overflow-hidden">
           <div className="flex items-center z-10">
             <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tổng số dư đầu kỳ:</div>
           </div>
           <div className="text-[#194b8e] font-bold text-xl z-10">
             {formatCurrency(totalInitial)}
           </div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between flex-1 relative overflow-hidden">
           <div className="flex items-center z-10">
             <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tổng số dư hiện tại:</div>
           </div>
           <div className="text-[#194b8e] font-bold text-xl z-10">
             {formatCurrency(totalCurrent)}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col mb-4 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Tên tài khoản</th>
                <th className="px-6 py-4">Số dư đầu kỳ</th>
                <th className="px-6 py-4">Phát sinh tăng</th>
                <th className="px-6 py-4">Phát sinh giảm</th>
                <th className="px-6 py-4">Số dư hiện tại</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {accounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                     <div className="flex flex-col items-center justify-center">
                        <Wallet className="w-12 h-12 text-gray-200 mb-3" />
                        <span className="font-medium text-gray-500">Chưa có tài khoản nào</span>
                     </div>
                  </td>
                </tr>
              ) : (
                accounts.map(acc => {
                  const increase = acc.balance > (acc.initialBalance || 0) ? acc.balance - (acc.initialBalance || 0) : 0;
                  const decrease = (acc.initialBalance || 0) > acc.balance ? (acc.initialBalance || 0) - acc.balance : 0;
                  return (
                    <tr key={acc.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-3 bg-gray-50 rounded-lg p-1.5 shadow-sm border border-gray-100 leading-none">{acc.icon || '🏦'}</span>
                          <div>
                            <div className="font-bold text-gray-800">{acc.name}</div>
                            {acc.type === 'BANK' && (
                              <div className="text-xs text-gray-500 mt-0.5">{acc.bankName} - {acc.accountNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-600">{formatCurrency(acc.initialBalance || 0)}</td>
                      <td className="px-6 py-4 font-medium text-green-600">{increase > 0 ? `+${formatCurrency(increase)}` : '-'}</td>
                      <td className="px-6 py-4 font-medium text-red-500">{decrease > 0 ? `-${formatCurrency(decrease)}` : '-'}</td>
                      <td className="px-6 py-4 font-bold text-[#194b8e]">{formatCurrency(acc.balance)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-3">
                          <button 
                            onClick={() => handleOpenEdit(acc)} 
                            className="text-blue-600 hover:text-blue-800 font-medium transition-colors p-1"
                            title="Sửa"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeletingId(acc.id)} 
                            className="text-red-500 hover:text-red-700 font-medium transition-colors p-1"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-[#5176ea]">{editingAccountId ? 'Sửa thông tin tài khoản' : 'Thêm tài khoản mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="space-y-5">
                 
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Tên tài khoản: <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8fafd] transition-colors"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-1">Loại tài khoản: <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as 'CASH'|'BANK'})}
                        className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8fafd] transition-colors"
                      >
                        <option value="CASH">Tiền mặt</option>
                        <option value="BANK">Ngân hàng</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-1">Số dư đầu kỳ: <span className="text-red-500">*</span></label>
                      <input 
                        type="number"
                        value={formData.initialBalance}
                        onChange={e => setFormData({...formData, initialBalance: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8fafd] transition-colors"
                      />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-1">Thông tin ngân hàng:</label>
                      <input 
                        type="text"
                        placeholder="Tên ngân hàng"
                        value={formData.bankName}
                        onChange={e => setFormData({...formData, bankName: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8fafd] transition-colors"
                        disabled={formData.type === 'CASH'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-medium mb-1">Số tài khoản:</label>
                       <input 
                        type="text"
                        placeholder="Số tài khoản ngân hàng"
                        value={formData.accountNumber}
                        onChange={e => setFormData({...formData, accountNumber: e.target.value})}
                        className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#f8fafd] transition-colors"
                        disabled={formData.type === 'CASH'}
                      />
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-2">Icon: <span className="text-red-500">*</span></label>
                    <div className="flex gap-3">
                       {ICONS.map(ic => (
                         <button 
                           key={ic}
                           onClick={() => setFormData({...formData, icon: ic})}
                           className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-all ${formData.icon === ic ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500 ring-offset-2' : 'bg-[#f8fafd] hover:bg-gray-100 border border-transparent'}`}
                         >
                           {ic}
                         </button>
                       ))}
                    </div>
                 </div>

               </div>
            </div>
            
            <div className="px-6 py-5 flex justify-center space-x-4 shrink-0 mt-4 border-t border-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-8 py-2.5 bg-[#f3f4f6] text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors w-28 text-center"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave} 
                className="px-8 py-2.5 bg-[#1447a1] text-white rounded-full text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md w-28 text-center"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deletingId}
        title="Xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
