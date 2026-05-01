import { Plus, Search, FileText, Pencil, Trash2, X } from 'lucide-react';
import { Header } from '../components/Header';
import { formatCurrency } from '../lib/utils';
import { useState } from 'react';
import { Target } from '../data';
import { ConfirmModal } from '../components/ConfirmModal';
import { useData } from '../context/DataContext';

export function Targets({ type }: { type: 'CUSTOMER' | 'SUPPLIER' }) {
  const isCustomer = type === 'CUSTOMER';
  const title = isCustomer ? "Quản lý khách hàng" : "Quản lý nhà cung cấp";
  const btnText = isCustomer ? "Thêm khách hàng" : "Thêm nhà cung cấp";
  const searchPlaceholder = isCustomer ? "Tìm kiếm khách hàng..." : "Tìm kiếm nhà cung cấp...";
  
  const { targets, setTargets } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    totalDebt: 0
  });

  const displayedTargets = targets.filter(t => t.type === type && t.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const totalDebt = displayedTargets.reduce((sum, t) => sum + t.totalDebt, 0);

  const handleOpenAdd = () => {
    setEditingTargetId(null);
    setFormData({ name: '', phone: '', email: '', totalDebt: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Target) => {
    setEditingTargetId(t.id);
    setFormData({
      name: t.name,
      phone: t.phone || '',
      email: t.email || '',
      totalDebt: t.totalDebt || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      alert('Vui lòng nhập tên');
      return;
    }

    if (editingTargetId) {
      setTargets(targets.map(t => 
        t.id === editingTargetId ? { ...t, ...formData } : t
      ));
    } else {
      const newTarget: Target = {
        id: `tgt${Date.now()}`,
        type,
        ...formData
      };
      setTargets([...targets, newTarget]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setTargets(targets.filter(t => t.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Header 
        title={title}
        actions={
          <button 
            onClick={handleOpenAdd}
            className="flex items-center px-4 py-2 bg-[#194b8e] text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            {btnText}
          </button>
        }
      />

      <div className="flex gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between w-64 shrink-0">
           <div className="flex items-center">
             <FileText className="w-5 h-5 text-blue-500 mr-2" />
             <div className="text-sm font-medium text-gray-600">Tổng công nợ phải {isCustomer ? 'thu' : 'trả'}:</div>
           </div>
           <div className="text-green-600 font-bold ml-2">
             {formatCurrency(totalDebt)}
           </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col mb-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Tên</th>
                <th className="px-6 py-4">Số điện thoại</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Công nợ</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedTargets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Không có dữ liệu</td>
                </tr>
              ) : (
                displayedTargets.map(t => (
                  <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{t.name}</td>
                    <td className="px-6 py-4 text-gray-600">{t.phone || '-'}</td>
                    <td className="px-6 py-4 text-gray-600">{t.email || '-'}</td>
                    <td className="px-6 py-4 font-medium text-red-500">{formatCurrency(t.totalDebt || 0)}</td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-bold text-[#1447a1]">
                {editingTargetId ? 'Chỉnh sửa' : btnText}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="space-y-4">
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Tên {isCustomer ? 'khách hàng' : 'nhà cung cấp'}: <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Số điện thoại:</label>
                    <input 
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Email:</label>
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Công nợ ban đầu:</label>
                    <input 
                      type="number"
                      value={formData.totalDebt}
                      onChange={e => setFormData({...formData, totalDebt: Number(e.target.value)})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                    />
                 </div>
               </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-center space-x-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 transition-colors"
               >
                Hủy
              </button>
              <button 
                onClick={handleSave} 
                className="px-8 py-2.5 bg-[#1447a1] text-white rounded-full text-sm font-semibold hover:bg-blue-900 shadow-md transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deletingId}
        title={`Xóa ${isCustomer ? 'khách hàng' : 'nhà cung cấp'}`}
        message="Bạn có chắc chắn muốn xóa không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
