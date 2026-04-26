import React from 'react';
import { 
  Home, Users, Calendar, Package, MapPin, Settings, LogOut 
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Hội Viên', path: '/members' },
    { icon: Calendar, label: 'Lịch Học', path: '/schedule' },
    { icon: Package, label: 'Gói Tập', path: '/packages-admin' },
    { icon: MapPin, label: 'Chi Nhánh', path: '/branches' },
    { icon: Settings, label: 'Cài Đặt', path: '/settings' }
  ];

  return (
    <aside 
      style={{ width: '260px', minWidth: '260px', backgroundColor: '#1a1c23' }} 
      className="text-gray-300 flex flex-col h-full shrink-0 border-r border-gray-800 font-['Montserrat']"
    >
      
      {/* KHU VỰC LOGO */}
      <div className="p-6 flex items-center justify-center h-24 border-b border-gray-800">
        <img 
          src="/logogy.png" 
          alt="TwelveFit Logo" 
          className="w-48 h-auto object-contain" 
          onError={(e) => { e.target.src = "https://via.placeholder.com/150x50?text=TWELVEFIT"; }} 
        />
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 px-4 space-y-3 mt-6 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={index} 
              to={item.path} 
              className={`flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.3)] scale-[1.02]' 
                  : 'hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 3 : 2} />
              <span className={`text-[11px] uppercase tracking-[0.15em] ${isActive ? 'font-black' : 'font-bold text-gray-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="p-6 border-t border-gray-800 bg-black/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black shadow-lg border border-white/10">
            AD
          </div>
          <div>
            <p className="text-white font-black text-[11px] uppercase tracking-wider">Admin Manager</p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">ID: 125039</p>
          </div>
        </div>
        
        <button className="flex items-center justify-center gap-2 w-full py-3 border border-gray-700 rounded-xl hover:bg-red-600 hover:border-red-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em]">
          <LogOut size={14} /> Đăng xuất
        </button>
      </div>
    </aside>
  );
}