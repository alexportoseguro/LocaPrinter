import { 
  Printer, Users, FileText, Settings, BarChart, Wrench, 
  LogOut, Menu
} from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: <BarChart />, label: 'Dashboard' },
    { id: 'equipment', icon: <Printer />, label: 'Equipamentos' },
    { id: 'customers', icon: <Users />, label: 'Clientes' },
    { id: 'contracts', icon: <FileText />, label: 'Contratos' },
    { id: 'maintenance', icon: <Wrench />, label: 'Manutenção' },
    { id: 'settings', icon: <Settings />, label: 'Configurações' },
  ];

  return (
    <div className={`fixed left-0 top-0 h-screen flex flex-col bg-indigo-800 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-indigo-700">
        {!isCollapsed && <span className="font-bold text-xl">PrintTech</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center px-4 py-3 hover:bg-indigo-700 transition-colors ${
              currentPage === item.id ? 'bg-indigo-700' : ''
            }`}
          >
            <span className="w-6 h-6">{item.icon}</span>
            {!isCollapsed && <span className="ml-4">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-indigo-700">
        <button 
          className="w-full flex items-center px-4 py-3 hover:bg-indigo-700 transition-colors"
          onClick={() => {/* handle logout */}}
        >
          <span className="w-6 h-6"><LogOut /></span>
          {!isCollapsed && <span className="ml-4">Sair</span>}
        </button>
      </div>
    </div>
  );
}