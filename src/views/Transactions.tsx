import { Download, Plus, Search, ArrowUpCircle, ArrowDownCircle, FileText, Banknote, CreditCard, X, Pencil, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { formatCurrency } from '../lib/utils';
import { useState } from 'react';
import { Transaction } from '../data';
import { ConfirmModal } from '../components/ConfirmModal';
import { useData } from '../context/DataContext';

export function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { transactions, setTransactions, accounts, categories, targets, personnelList } = useData();

  const [formData, setFormData] = useState({
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    accountId: '',
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    targetId: '',
    invoiceNo: '',
    invoiceDate: '',
    personnelId: 'FOUNDER',
    notes: ''
  });

  // Calculate stats
  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0);
  const totalIncomeDebt = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.unpaidAmount, 0);
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenseDebt = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.unpaidAmount, 0);

  const handleOpenAdd = () => {
    setEditingTransactionId(null);
    setFormData({
      type: 'EXPENSE',
      accountId: '',
      categoryId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      targetId: '',
      invoiceNo: '',
      invoiceDate: '',
      personnelId: 'FOUNDER',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Transaction) => {
    setEditingTransactionId(t.id);
    setFormData({
      type: t.type,
      accountId: t.accountId || '',
      categoryId: t.categoryId || '',
      amount: String(t.amount || ''),
      date: t.date || new Date().toISOString().split('T')[0],
      targetId: t.targetId || '',
      invoiceNo: t.invoiceNo || '',
      invoiceDate: t.invoiceDate || '',
      personnelId: t.personnelId || 'FOUNDER',
      notes: t.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setTransactions(transactions.filter(t => t.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (!formData.accountId || !formData.categoryId || !formData.amount || !formData.date) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc (*)');
      return;
    }

    if (editingTransactionId) {
      setTransactions(transactions.map(t => 
        t.id === editingTransactionId ? {
          ...t,
          date: formData.date,
          type: formData.type,
          categoryId: formData.categoryId,
          amount: Number(formData.amount),
          accountId: formData.accountId,
          targetId: formData.targetId,
          invoiceNo: formData.invoiceNo || undefined,
          invoiceDate: formData.invoiceDate || undefined,
          notes: formData.notes,
          personnelId: formData.personnelId,
          // Re-calculate unpaidAmount based on the new amount if necessary
          unpaidAmount: Number(formData.amount) - t.paidAmount
        } : t
      ));
    } else {
      const newTx: Transaction = {
        id: `t${Date.now()}`,
        date: formData.date,
        type: formData.type,
        categoryId: formData.categoryId,
        amount: Number(formData.amount),
        accountId: formData.accountId,
        targetId: formData.targetId,
        invoiceNo: formData.invoiceNo || undefined,
        invoiceDate: formData.invoiceDate || undefined,
        paidAmount: 0,
        unpaidAmount: Number(formData.amount),
        status: 'UNPAID',
        notes: formData.notes,
        personnelId: formData.personnelId
      };
      setTransactions([newTx, ...transactions]);
    }

    setIsModalOpen(false);
    setFormData({
      type: 'EXPENSE',
      accountId: '',
      categoryId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      targetId: '',
      invoiceNo: '',
      invoiceDate: '',
      personnelId: 'FOUNDER',
      notes: ''
    });
  };

  return (
    <div className="h-full flex flex-col min-h-0">
      <Header 
        title="Quản lý giao dịch" 
        actions={
          <>
            <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
            <button 
              onClick={handleOpenAdd}
              className="flex items-center px-4 py-2 bg-[#194b8e] text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm giao dịch
            </button>
          </>
        }
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 mb-6">
        <div className="flex space-x-2 shrink-0 bg-gray-50 p-1 rounded-lg border border-gray-200">
          {['Tháng này', 'Quý này', 'Năm này', 'Tùy chỉnh'].map(m => (
            <button key={m} className={`px-4 py-1.5 text-sm rounded-md font-medium transition-colors ${m === 'Tháng này' ? 'bg-[#194b8e] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="w-48 ml-4">
            <select className="w-full border-gray-200 rounded-lg text-sm py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white border shadow-sm outline-none">
              <option>Tất cả danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm kiếm giao dịch..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Tổng doanh thu" amount={totalIncome} icon={<ArrowUpCircle className="text-white w-6 h-6" />} color="bg-blue-500" />
        <StatCard title="Tổng công nợ phải thu" amount={totalIncomeDebt} icon={<FileText className="text-white w-6 h-6" />} color="bg-blue-400" />
        <StatCard title="Tổng chi phí" amount={totalExpense} icon={<ArrowDownCircle className="text-white w-6 h-6" />} color="bg-red-500" />
        <StatCard title="Tổng công nợ phải trả" amount={totalExpenseDebt} icon={<Banknote className="text-white w-6 h-6" />} color="bg-red-400" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-100 text-sm bg-white shrink-0">
           <div className="flex space-x-2">
             <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 transition-colors">Pre</button>
             <button className="px-3 py-1 border rounded hover:bg-gray-50 text-gray-600 transition-colors">Next</button>
           </div>
           <div className="text-gray-500 font-medium text-xs">Hiển thị 1-{transactions.length} của {transactions.length} giao dịch</div>
        </div>
        <div className="overflow-auto flex-1 absolute inset-0 top-[53px]">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-max">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4">Loại</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Số tiền</th>
                <th className="px-6 py-4">Tài khoản</th>
                <th className="px-6 py-4">Đối tượng</th>
                <th className="px-6 py-4">Số hóa đơn</th>
                <th className="px-6 py-4">Ngày hóa đơn</th>
                <th className="px-6 py-4">Đã thanh toán</th>
                <th className="px-6 py-4">Còn nợ</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ghi chú</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-gray-400">
                     <div className="flex flex-col items-center justify-center">
                        <CreditCard className="w-12 h-12 text-gray-200 mb-3" />
                        <span className="font-medium text-gray-500">Không có dữ liệu giao dịch</span>
                     </div>
                  </td>
                </tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-600">{t.date}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${t.type === 'INCOME' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type === 'INCOME' ? 'Doanh thu' : 'Chi phí'}
                       </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{categories.find(c => c.id === t.categoryId)?.name || '-'}</td>
                    <td className={`px-6 py-4 font-bold ${t.type === 'INCOME' ? 'text-blue-600' : 'text-red-500'}`}>
                       {t.type === 'INCOME' ? '+' : '-'}{formatCurrency(t.amount)}
                    </td>
                    <td className="px-6 py-4">{accounts.find(a => a.id === t.accountId)?.name || '-'}</td>
                    <td className="px-6 py-4">{targets.find(target => target.id === t.targetId)?.name || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{t.invoiceNo || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{t.invoiceDate || '-'}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{formatCurrency(t.paidAmount)}</td>
                    <td className="px-6 py-4 text-red-500 font-medium">{formatCurrency(t.unpaidAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${t.status === 'PAID' ? 'bg-green-100 text-green-700' : t.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                        {t.status === 'PAID' ? 'Đã thanh toán' : t.status === 'PARTIAL' ? 'Thanh toán 1 phần' : 'Chưa thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[150px] truncate text-gray-500" title={t.notes}>{t.notes || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                         <button 
                           onClick={() => handleOpenEdit(t)}
                           className="text-blue-600 hover:text-blue-800 font-medium transition-colors p-1"
                           title="Sửa"
                         >
                           <Pencil className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setDeletingId(t.id)}
                           className="text-red-500 hover:text-red-700 font-medium transition-colors p-1"
                           title="Xóa"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-[#194b8e]">{editingTransactionId ? 'Chỉnh sửa giao dịch' : 'Thêm giao dịch mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
               <div className="space-y-6">
                 {/* Loại giao dịch */}
                 <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-3">Loại giao dịch: <span className="text-red-500">*</span></label>
                    <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-inner">
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'EXPENSE'})} 
                        className={`flex-1 py-2.5 text-sm rounded-lg font-bold flex items-center justify-center transition-all ${formData.type === 'EXPENSE' ? 'bg-[#ff4d4f] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                         &darr; Chi phí
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, type: 'INCOME'})} 
                        className={`flex-1 py-2.5 text-sm rounded-lg font-bold flex items-center justify-center transition-all ${formData.type === 'INCOME' ? 'bg-blue-600 text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-200'}`}
                      >
                         &uarr; Doanh thu
                      </button>
                      <button 
                         type="button" 
                         disabled
                         className="flex-1 py-2.5 text-sm rounded-lg font-bold flex items-center justify-center text-gray-400 bg-transparent cursor-not-allowed hidden"
                       >
                         &rlarr; Chuyển khoản
                      </button>
                    </div>
                 </div>

                 {/* Tài khoản & Danh mục */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">
                        {formData.type === 'INCOME' ? 'Tài khoản thu' : 'Tài khoản chi'}: <span className="text-red-500">*</span>
                      </label>
                      <select 
                        value={formData.accountId}
                        onChange={e => setFormData({...formData, accountId: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      >
                        <option value="">Chọn tài khoản...</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Danh mục: <span className="text-red-500">*</span></label>
                      <select 
                        value={formData.categoryId}
                        onChange={e => setFormData({...formData, categoryId: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      >
                        <option value="">Chọn danh mục...</option>
                        {categories.filter(c => c.type === formData.type).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                 </div>

                 {/* Số tiền & Ngày giao dịch */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Số tiền: <span className="text-red-500">*</span></label>
                      <input 
                        type="number"
                        placeholder="0"
                        value={formData.amount}
                        onChange={e => setFormData({...formData, amount: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Ngày giao dịch: <span className="text-red-500">*</span></label>
                      <input 
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                         className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                 </div>

                 {/* Đối tượng */}
                 <div>
                    <label className="block text-sm text-gray-700 font-semibold mb-2">
                      {formData.type === 'INCOME' ? 'Khách hàng' : 'Nhà cung cấp'}:
                    </label>
                    <select 
                        value={formData.targetId}
                        onChange={e => setFormData({...formData, targetId: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      >
                        <option value="">Chọn {formData.type === 'INCOME' ? 'khách hàng' : 'nhà cung cấp'}...</option>
                        {targets.filter(t => t.type === (formData.type === 'INCOME' ? 'CUSTOMER' : 'SUPPLIER')).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                 </div>

                 {/* Hóa đơn */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Số hóa đơn:</label>
                      <input 
                        type="text"
                        placeholder="VD: HD-001"
                        value={formData.invoiceNo}
                        onChange={e => setFormData({...formData, invoiceNo: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Ngày hóa đơn:</label>
                      <input 
                        type="date"
                        value={formData.invoiceDate}
                        onChange={e => setFormData({...formData, invoiceDate: e.target.value})}
                         className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                 </div>

                 {/* Note & Personnel */}
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Nhân viên/Bộ phận thực hiện:</label>
                      <input 
                        type="text"
                        value={formData.personnelId}
                        onChange={e => setFormData({...formData, personnelId: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 font-semibold mb-2">Ghi chú:</label>
                       <input 
                        type="text"
                        placeholder="Nhập ghi chú..."
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                        className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                      />
                    </div>
                 </div>

                 {/* TT Thanh toán */}
                 <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-center text-[#194b8e] font-bold mb-4">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Thông tin thanh toán:
                    </div>
                    <div className="flex flex-col sm:flex-row gap-6 mb-4">
                       <div className="text-sm font-semibold text-gray-700">Đã thanh toán: <span className="text-green-600 ml-1">0 VND</span></div>
                       <div className="text-sm font-semibold text-gray-700">Còn lại: <span className="text-red-500 ml-1">{formData.amount ? formatCurrency(Number(formData.amount)) : '0 VND'}</span></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-6">Trạng thái: <span className="text-red-500 ml-1 font-bold">Chưa thanh toán</span></div>
                    <div className="text-center py-6 text-gray-500 text-sm italic border-t border-blue-200">
                       Chưa có thanh toán nào
                    </div>
                 </div>

               </div>
            </div>
            
            <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex justify-center space-x-4 shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors shadow-sm w-32">Hủy</button>
              <button onClick={handleSave} className="px-8 py-2.5 bg-[#194b8e] text-white rounded-full text-sm font-bold hover:bg-blue-800 transition-colors shadow-md w-32">Lưu</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deletingId}
        title="Xóa giao dịch"
        message="Bạn có chắc chắn muốn xóa giao dịch này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

function StatCard({ title, amount, icon, color }: { title: string, amount: number, icon: React.ReactNode, color: string }) {
  return (
    <div className={`rounded-xl p-5 shadow-sm text-white relative overflow-hidden flex items-center ${color}`}>
      <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm mr-4 shrink-0">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="text-xs font-semibold uppercase tracking-wider mb-1 opacity-90">{title}</div>
        <div className="text-2xl font-bold truncate">{formatCurrency(amount)}</div>
      </div>
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
    </div>
  );
}
