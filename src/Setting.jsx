import React from 'react';
import { 
  UserCog, 
  Bell, 
  CreditCard, 
  Shield, 
  ChevronRight 
} from 'lucide-react';

const SettingPage = () => {
  const settingsOptions = [
    {
      title: "Account Settings",
      desc: "Quản lý thông tin cá nhân và tài khoản admin",
      icon: <UserCog size={24} />,
    },
    {
      title: "Notification Settings",
      desc: "Cấu hình thông báo hệ thống và email nhắc nhở",
      icon: <Bell size={24} />,
    },
    {
      title: "Billing Settings",
      desc: "Lịch sử giao dịch, hóa đơn và doanh thu",
      icon: <CreditCard size={24} />,
    },
    {
      title: "Security Settings",
      desc: "Bảo mật, đổi mật khẩu và phân quyền quản trị",
      icon: <Shield size={24} />,
    },
  ];

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden font-sans relative">
      
      {/* 1. NỀN ẢNH TỪ THƯ MỤC PUBLIC */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bgmemdash.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 2. LỚP PHỦ LÀM TỐI VÀ LÀM MỜ (Đồng bộ với Dashboard) */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[4px]"></div>
      </div>

      {/* --- NỘI DUNG CHÍNH (z-10) --- */}
      <div className="relative z-10 flex-1 overflow-auto p-8 lg:p-16">
        
        {/* Tiêu đề trang */}
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-widest text-white uppercase italic">
            Cài Đặt <span className="text-red-600">Hệ Thống</span>
          </h1>
          <div className="h-1.5 w-24 bg-red-600 mt-3 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
          <p className="text-gray-400 mt-4 text-sm font-medium italic">
            Tùy chỉnh cấu hình TwelveFit để tối ưu hiệu suất quản lý.
          </p>
        </header>

        {/* Grid chứa các Setting Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {settingsOptions.map((item, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2rem] 
                         flex items-center justify-between cursor-pointer 
                         hover:bg-white/10 hover:border-red-600/40 transition-all duration-500 shadow-2xl"
            >
              <div className="flex items-center gap-8">
                {/* Icon tròn đỏ với hiệu ứng Glow */}
                <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center 
                              shadow-[0_10px_20px_rgba(220,38,38,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {React.cloneElement(item.icon, { className: "text-white" })}
                </div>

                <div>
                  <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 font-medium tracking-wide">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Mũi tên dẫn hướng */}
              <div className="bg-white/5 p-2 rounded-full group-hover:bg-red-600 transition-colors">
                <ChevronRight 
                  size={20} 
                  className="text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" 
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer trang setting */}
        <footer className="mt-16 border-t border-white/5 pt-6 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
          TwelveFit Management System • Version 4.0.1
        </footer>
      </div>
    </main>
  );
};

export default SettingPage;