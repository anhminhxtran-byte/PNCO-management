import { ChevronLeft } from 'lucide-react';
import { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  actions?: ReactNode;
}

export function Header({ title, actions }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <button className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center mr-4 text-gray-500 hover:bg-gray-50 shadow-sm">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-[#194b8e]">{title}</h2>
      </div>
      <div className="flex gap-3">
        {actions}
      </div>
    </div>
  );
}
