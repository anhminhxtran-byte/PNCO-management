import {
  Home,
  ArrowRightLeft,
  Briefcase,
  Tags,
  Users,
  Truck,
  UserCog,
  Lightbulb,
  User,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home },
    { id: 'transactions', label: 'Giao dịch', icon: ArrowRightLeft },
    { id: 'accounts', label: 'Tài khoản', icon: Briefcase },
    { id: 'categories', label: 'Danh mục', icon: Tags },
    { id: 'customers', label: 'Khách hàng', icon: Users },
    { id: 'suppliers', label: 'Nhà cung cấp', icon: Truck },
    { id: 'personnel', label: 'Nhân sự', icon: UserCog },
    { id: 'gas-setup', label: 'Cài đặt GAS', icon: Lightbulb },
  ];

  return (
    <div className="w-64 bg-[#194b8e] text-white flex flex-col h-screen shrink-0">
      <div className="p-6 flex flex-col items-center border-b border-blue-800">
        <div className="relative">
          <Lightbulb className="w-12 h-12 text-yellow-400 mb-2" fill="currentColor" />
          <div className="absolute top-1 right-2 w-2 h-2 text-white bg-white rounded-full"></div>
        </div>
        <h1 className="text-center font-bold text-lg leading-tight">
          QUẢN LÝ THU CHI<br />DOANH NGHIỆP
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center px-6 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600/50 border-l-4 border-white'
                  : 'text-blue-100 hover:bg-white/10 border-l-4 border-transparent'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-blue-800">
        <button className="flex items-center w-full px-2 py-2 hover:bg-white/10 rounded">
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3">
            <User className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-yellow-500">FOUNDER</div>
            <div className="text-xs text-blue-200">Đổi mật khẩu</div>
          </div>
        </button>
        <div className="text-center text-xs text-blue-400 mt-4">
          Version 3.1
        </div>
      </div>
    </div>
  );
}
