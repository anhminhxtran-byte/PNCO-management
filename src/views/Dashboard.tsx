import { DollarSign, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { Header } from '../components/Header';
import { formatCurrency } from '../lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function Dashboard() {
  const customData = [
    { name: 'Tháng 1', income: 4000000, expense: 2400000 },
    { name: 'Tháng 2', income: 3000000, expense: 1398000 },
    { name: 'Tháng 3', income: 2000000, expense: 9800000 },
    { name: 'Tháng 4', income: 2780000, expense: 3908000 },
    { name: 'Tháng 5', income: 1890000, expense: 4800000 },
    { name: 'Tháng 6', income: 2390000, expense: 3800000 },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <Header title="Tổng quan tài chính" />
        <div className="flex space-x-2">
          {['Tháng này', 'Quý này', 'Năm này', 'Tùy chỉnh'].map(m => (
            <button key={m} className={`px-4 py-1.5 text-sm rounded ${m === 'Tháng này' ? 'bg-[#194b8e] text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="Doanh thu" amount={15000000} debt={5000000} color="bg-blue-500" icon={<DollarSign />} />
        <StatCard title="Chi phí" amount={2000000} debt={1000000} color="bg-red-400" icon={<ShoppingCart />} />
        <StatCard title="Lợi nhuận" amount={13000000} color="bg-green-500" icon={<TrendingUp />} />
        <StatCard title="Tổng số dư tài khoản" amount={170000000} color="bg-yellow-500" icon={<Wallet />} />
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-sm font-medium text-blue-800 mb-4">Doanh thu - Chi phí theo tháng</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => value === 0 ? '0' : value/1000000 + 'M'} />
                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: number) => formatCurrency(value)} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="income" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Chi phí" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative">
          <div className="text-center w-full">
            <h3 className="text-sm font-medium text-blue-800 absolute top-4 left-4">Chi phí theo danh mục</h3>
            <p className="text-sm font-bold mt-8">Không có dữ liệu chi phí</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative">
          <div className="text-center w-full">
            <h3 className="text-sm font-medium text-blue-800 absolute top-4 left-4">Doanh thu theo danh mục</h3>
            <p className="text-sm font-bold mt-8">Không có dữ liệu doanh thu</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mt-6 min-h-[200px]">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative">
            <h3 className="text-sm font-medium text-blue-800 absolute top-4 left-4">Sử dụng tài khoản</h3>
            <p className="text-sm font-bold">Không có dữ liệu tài khoản</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative">
            <h3 className="text-sm font-medium text-blue-800 absolute top-4 left-4">Top 5 khách hàng</h3>
            <p className="text-sm font-bold">Không có dữ liệu khách hàng</p>
        </div>
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center relative">
            <h3 className="text-sm font-medium text-blue-800 absolute top-4 left-4">Top 5 nhà cung cấp</h3>
            <p className="text-sm font-bold">Không có dữ liệu nhà cung cấp</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, amount, debt, color, icon }: { title: string, amount: number, debt?: number, color: string, icon: React.ReactNode }) {
  return (
    <div className={`${color} rounded-xl p-5 text-white shadow-sm relative overflow-hidden`}>
      <div className="flex items-start">
        <div className="bg-white/20 p-2 rounded-full mr-4">
          {icon}
        </div>
        <div>
          <div className="text-sm mb-1 opacity-90">{title}</div>
          <div className="text-xl font-bold">{formatCurrency(amount)}</div>
          {debt !== undefined && (
            <div className="text-xs mt-1 opacity-80">Công nợ: {formatCurrency(debt)}</div>
          )}
        </div>
      </div>
    </div>
  );
}
