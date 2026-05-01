import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { Header } from '../components/Header';
import { useState } from 'react';
import { PersonnelData } from '../data';
import { ConfirmModal } from '../components/ConfirmModal';
import { useData } from '../context/DataContext';

export function Personnel() {
  const { personnelList, setPersonnelList } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: '',
    permissions: ''
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', username: '', role: '', permissions: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: PersonnelData) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      username: p.username,
      role: p.role,
      permissions: p.permissions || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.username) {
      alert('Vui lòng nhập họ tên và tên đăng nhập');
      return;
    }

    if (editingId) {
      setPersonnelList(personnelList.map(p => 
        p.id === editingId ? { ...p, ...formData } : p
      ));
    } else {
      const newPersonnel: PersonnelData = {
        id: `p${Date.now()}`,
        ...formData
      };
      setPersonnelList([...personnelList, newPersonnel]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      setPersonnelList(personnelList.filter(p => p.id !== deletingId));
      setDeletingId(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Header 
        title="Quản lý nhân sự"
        actions={
          <button 
            onClick={handleOpenAdd}
            className="flex items-center px-4 py-2 bg-[#194b8e] text-white rounded-md text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhân sự
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col mb-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b">
              <tr>
                <th className="px-6 py-4">Họ và tên</th>
                <th className="px-6 py-4">Tên đăng nhập</th>
                <th className="px-6 py-4">Vai trò</th>
                <th className="px-6 py-4">Phân quyền chi tiết</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {personnelList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Không có dữ liệu</td>
                </tr>
              ) : (
                personnelList.map(p => (
                  <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{p.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{p.username}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${p.role === 'Quản trị viên' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {p.role || 'Nhân viên'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.permissions || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-3">
                         <button 
                           onClick={() => handleOpenEdit(p)}
                           className="text-blue-600 hover:text-blue-800 font-medium transition-colors p-1"
                           title="Sửa"
                         >
                           <Pencil className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setDeletingId(p.id)}
                           className="text-red-500 hover:text-red-700 font-medium transition-colors p-1"
                           title="Xóa"
                           disabled={p.username === 'admin'}
                         >
                           <Trash2 className={`w-4 h-4 ${p.username === 'admin' ? 'opacity-30' : ''}`} />
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
                {editingId ? 'Chỉnh sửa nhân sự' : 'Thêm nhân sự mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
                 <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
               <div className="space-y-4">
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Họ và tên: <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Tên đăng nhập: <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({...formData, username: e.target.value})}
                      disabled={!!editingId && formData.username === 'admin'}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5 disabled:bg-gray-100 disabled:text-gray-400"
                    />
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Vai trò:</label>
                    <select
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full border border-gray-200 rounded-lg py-2px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-2.5 bg-white"
                    >
                      <option value="Nhân viên">Nhân viên</option>
                      <option value="Quản trị viên">Quản trị viên</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm text-gray-700 font-medium mb-1">Phân quyền chi tiết:</label>
                    <textarea 
                      rows={2}
                      value={formData.permissions}
                      onChange={e => setFormData({...formData, permissions: e.target.value})}
                      placeholder="Ví dụ: Xem, Thêm mới..."
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
        title="Xóa nhân sự"
        message="Bạn có chắc chắn muốn xóa nhân sự này không? Hành động này không thể hoàn tác."
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
