import React from 'react';
import { 
  Users, Calendar, DollarSign, CheckSquare, Search, Bell 
} from 'lucide-react';

export default function TwelveFitDashboard() {
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
        {/* 2. LỚP PHỦ LÀM TỐI VÀ LÀM MỜ ẢNH NỀN */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>
      </div>

      {/* --- NỘI DUNG PHÍA TRÊN LỚP NỀN (z-10) --- */}
      
      {/* Header */}
      <header className="relative z-10 bg-black/30 backdrop-blur-md px-8 py-4 flex justify-between items-center border-b border-white/10 text-white">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chào mừng bạn trở lại!</h1>
          <p className="text-sm text-gray-400 mt-1 italic">Dữ liệu hệ thống TwelveFit cập nhật thời gian thực.</p>
        </div>
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-red-600 transition-all">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-transparent border-none focus:outline-none text-sm w-48 text-white placeholder:text-gray-500" 
              />
            </div>
            <div className="relative cursor-pointer hover:scale-110 transition-transform">
              <Bell size={20} className="text-gray-300" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-black"></span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer border border-white/20 p-1 rounded-full bg-white/5">
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-8 h-8 rounded-full" />
            </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="relative z-10 flex-1 overflow-auto p-8">
        
        {/* Stats Grid - Sử dụng hiệu ứng kính (Glassmorphism) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Tổng hội viên" value="1,254" trend="+12%" />
          <StatCard icon={DollarSign} title="Doanh thu tháng" value="450.2M" trend="+8.5%" />
          <StatCard icon={Calendar} title="Lớp học hôm nay" value="24" trend="0%" trendColor="text-gray-400" />
          <StatCard icon={CheckSquare} title="Lượt Check-in" value="185" trend="+15%" />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Table: Yêu cầu đăng ký */}
          <div className="lg:col-span-2 bg-black/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/10 text-white">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-bold text-lg uppercase tracking-widest text-red-500">Yêu cầu đăng ký mới</h2>
              <button className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1 rounded-full transition-all">TẤT CẢ</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead>
                    <tr className="text-[10px] text-gray-500 border-b border-white/5 uppercase font-black">
                    <th className="pb-4">Hội viên</th>
                    <th className="pb-4">Gói dịch vụ</th>
                    <th className="pb-4 text-center">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    <TableRow name="Trần Anh Tuấn" package="Elite Membership" />
                    <TableRow name="Lê Thị Hồng" package="Passion (Pro)" />
                    <TableRow name="Phạm Minh Hoàng" package="Start-up" />
                </tbody>
                </table>
            </div>
          </div>

          {/* List: Lớp học sắp tới */}
          <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/10 text-white flex flex-col">
            <h2 className="font-bold text-lg mb-8 uppercase tracking-widest text-red-500">Lịch học sắp tới</h2>
            <div className="space-y-4 flex-1">
              <ClassItem time="18:00" name="Yoga Hatha" studio="Studio A · 120/30 HV" />
              <ClassItem time="19:30" name="Zumba Fitness" studio="Studio B · 25/30 HV" />
              <ClassItem time="20:00" name="Body Pump" studio="Studio A · 22/30 HV" />
            </div>
            <button className="w-full mt-8 bg-red-600 text-white font-black text-xs py-4 rounded-2xl hover:bg-red-700 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] active:scale-95 uppercase tracking-widest">
              Thêm lớp học +
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

// --- Sub-components với style Glassmorphism ---

function StatCard({ icon: Icon, title, value, trend, trendColor = "text-green-400" }) {
  return (
    <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col justify-between h-40 group hover:bg-white/10 transition-all cursor-default">
      <div className="flex justify-between items-start">
        <div className="bg-red-600 p-3 rounded-2xl text-white shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform">
          <Icon size={22} />
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-lg border border-white/10 bg-black/20 ${trendColor}`}>{trend}</span>
      </div>
      <div>
        <p className="text-[10px] text-gray-400 font-black tracking-widest mb-1 uppercase opacity-70">{title}</p>
        <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
      </div>
    </div>
  );
}

function TableRow({ name, package: pkg }) {
  return (
    <tr className="border-b border-white/5 last:border-none group">
      <td className="py-5 font-bold text-gray-200 group-hover:text-white transition-colors">{name}</td>
      <td className="py-5 text-gray-400 italic text-xs">{pkg}</td>
      <td className="py-5">
        <div className="flex justify-center gap-2">
           <button className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black transition-all border border-red-600/30">DUYỆT</button>
           <button className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-black transition-all border border-white/10">XÓA</button>
        </div>
      </td>
    </tr>
  );
}

function ClassItem({ time, name, studio }) {
  return (
    <div className="flex gap-4 items-center p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
      <div className="bg-red-600 text-white text-[11px] font-black px-3 py-2 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
        {time}
      </div>
      <div>
        <h4 className="font-bold text-gray-100 text-sm group-hover:text-red-500 transition-colors">{name}</h4>
        <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-tighter">{studio}</p>
      </div>
    </div>
  );
}