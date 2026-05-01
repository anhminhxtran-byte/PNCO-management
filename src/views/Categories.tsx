import { Plus, X, Pencil, Trash2 } from 'lucide-react';
import { Header } from '../components/Header';
import { useState } from 'react';
import { Category } from '../data';
import { ConfirmModal } from '../components/ConfirmModal';
import { useData } from '../context/DataContext';

const ICONS = ['📝','💵','💸','💰','📉','📊','🏦','💳','🧾','📚','🍎','🏪','⛽','🚑','👕','🔧','⛵','🍊','🚚','📈','📄','🛍️','🍕','🥘','🚕','✈️','🏢','🎓','🏥','💻','💧','🔥','👔'];

export function Categories() {
  const { categories, setCategories } = useData();
  const [activeTab, setActiveTab] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    icon: '📝',
    color: '#3b82f6'
  });

  const displayedCategories = categories.filter(c => c.type === activeTab);

  const handleOpenAdd = () => {
    setEditingCategoryId(null);
    setFormData({
      name: '',
      type: activeTab,
      icon: '📝',
      color: activeTab === 'INCOME' ? '#3b82f6' : '#ef4444'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setFormData({
      name: category.name,
      type: category.type,
      icon: category.icon || '📝',
      color: category.color || (category.type === 'INCOME' ? '#3b82f6' : '#ef4444')
    });
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setCategories(categories.filter(c => c.id !== deletingId));
      setDeletingId(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.icon) {
      alert('Vui lòng điền các trường bắt buộc (*)');
      return;
    }

    if (editingCategoryId) {
      setCategories(categories.map(c => 
        c.id === editingCategoryId ? { ...c, ...formData } : c
      ));
    } else {
      const newCategory: Category = {
        id: `c${Date.now()}`,
        ...formData
      };
      setCategories([...categories, newCategory]);
      // Switch to the tab where the new item was added
      setActiveTab(formData.type);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="h-full flex flex-col">
      <Header 
        title="Quản lý danh mục"
        actions={
          <button 
            onClick={handleOpenAdd}
            className="flex items-center px-4 py-2 bg-[#194b8e] text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm danh mục
          </button>
        }
      />

      <div className="flex border-b border-gray-200 mb-6 bg-white px-2 rounded-t-xl">
        <button 
          onClick={() => setActiveTab('INCOME')}
          className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'INCOME' ? 'border-[#194b8e] text-[#194b8e] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Danh mục doanh thu
        </button>
        <button 
          onClick={() => setActiveTab('EXPENSE')}
           className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'EXPENSE' ? 'border-[#194b8e] text-[#194b8e] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
        >
          Danh mục chi phí
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col mb-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedCategories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-12 text-gray-400">
                     <span className="font-medium text-gray-500">Không có dữ liệu</span>
                  </td>
                </tr>
              ) : (
                displayedCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mr-4 shadow-sm border border-gray-100"
                          style={{ backgroundColor: `${cat.color}15` }}
                        >
                          {cat.icon}
                        </div>
                        <span className="font-semibold text-gray-800">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                         <button 
                           onClick={() => handleOpenEdit(cat)}
                           className="text-blue-600 hover:text-blue-800 font-medium transition-colors p-1"
                           title="Sửa"
                         >
                           <Pencil className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setDeletingId(cat.id)}
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-xl font-bold text-[#1447a1]">{editingCategoryId ? 'Sửa danh mục' : 'Thêm danh mục mới'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-1">Tên danh mục: <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="VD: Lương" 
                    className="w-full border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-2">Loại: <span className="text-red-500">*</span></label>
                  <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 shadow-inner">
                     <button 
                       onClick={() => setFormData({...formData, type: 'EXPENSE', color: '#ef4444'})}
                       className={`flex-1 py-2.5 text-sm rounded-md font-semibold flex items-center justify-center transition-all ${formData.type === 'EXPENSE' ? 'bg-[#ff4d4f] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-200'}`}
                     >
                       &darr; Chi phí
                     </button>
                     <button 
                       onClick={() => setFormData({...formData, type: 'INCOME', color: '#3b82f6'})}
                       className={`flex-1 py-2.5 text-sm rounded-md font-semibold flex items-center justify-center transition-all ${formData.type === 'INCOME' ? 'bg-[#3b82f6] text-white shadow-md transform scale-[1.02]' : 'text-gray-500 hover:bg-gray-200'}`}
                     >
                       &uarr; Doanh thu
                     </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-700 font-medium mb-2">Icon: <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-7 sm:grid-cols-9 gap-2">
                    {ICONS.map((icon, i) => (
                      <button 
                        key={i} 
                        onClick={() => setFormData({...formData, icon})}
                        className={`text-xl p-2 rounded-xl transition-all ${formData.icon === icon ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-1' : 'hover:bg-blue-50 border border-transparent'}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-5 border-t border-gray-100 flex justify-center space-x-4 shrink-0 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-8 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm w-32 text-center"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2.5 bg-[#1447a1] text-white rounded-full text-sm font-semibold hover:bg-blue-900 transition-colors shadow-md w-32 text-center"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal 
        isOpen={!!deletingId}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
