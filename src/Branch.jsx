import React, { useState, useEffect } from 'react';
import {
  MapPin, Phone, Users, Activity, Edit3, Trash2, Plus,
  ExternalLink, CheckCircle2, AlertCircle, Clock
} from 'lucide-react';
import branchApi from './api/branchAPI';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchApi.getAll();
        setBranches(response.data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
        if (error.response?.status === 401) {
          setError('Chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.');
        } else if (error.response?.status === 404 || error.message?.includes('Network Error')) {
          setBranches([
            {
              id: 1,
              name: 'TwelveFit Thủ Đức',
              address: '123 Võ Văn Ngân, Thủ Đức',
              phone: '0909 123 456',
              members: 128,
              status: 'Đang hoạt động',
              load: '82%',
              image: '/gym-branch-1.jpg'
            },
            {
              id: 2,
              name: 'TwelveFit Quận 1',
              address: '45 Nguyễn Huệ, Quận 1',
              phone: '0908 654 321',
              members: 96,
              status: 'Đang hoạt động',
              load: '76%',
              image: '/gym-branch-2.jpg'
            }
          ]);
          setWarning('Backend chưa có API chi nhánh. Hiển thị dữ liệu demo tạm thời.');
        } else {
          setError('Không thể tải dữ liệu chi nhánh. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden font-sans relative text-white">
      
      {/* 1. NỀN ẢNH TỪ PUBLIC (Đồng bộ hệ thống) */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bgmemdash.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[4px]"></div>
      </div>

      {/* --- NỘI DUNG CHÍNH (z-10) --- */}
      <div className="relative z-10 flex-1 overflow-auto p-8 lg:p-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-wider">
              Hệ Thống <span className="text-red-600">Chi Nhánh</span>
            </h2>
            <div className="h-1 w-24 bg-red-600 mt-2 rounded-full mb-4 shadow-[0_0_15px_rgba(220,38,38,0.5)]"></div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Quản lý vận hành và mạng lưới cơ sở TwelveFit</p>
          </div>

          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 group">
            <Plus size={18} className="group-hover:rotate-90 transition-transform" /> Khai trương chi nhánh mới
          </button>
        </div>

        {/* Grid Chi Nhánh */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-8">Đang tải dữ liệu chi nhánh...</div>
          ) : error && branches.length === 0 ? (
            <div className="col-span-full text-center text-red-400 py-8">{error}</div>
          ) : branches.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">Không có dữ liệu chi nhánh</div>
          ) : (
            <>
              {warning && (
                <div className="col-span-full text-center text-yellow-300 py-4 px-6 rounded-3xl border border-yellow-500/20 bg-yellow-500/10">
                  {warning}
                </div>
              )}
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl transition-all hover:border-red-600/30"
                >
                  <div className="w-full md:w-48 h-48 md:h-auto relative">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent"></div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                          {branch.name}
                        </h3>
                        <div className="flex gap-2">
                          <button className="p-2 bg-white/5 rounded-xl hover:bg-blue-600/20 hover:text-blue-400 transition-all"><Edit3 size={14} /></button>
                          <button className="p-2 bg-white/5 rounded-xl hover:bg-red-600 transition-all"><Trash2 size={14} /></button>
                        </div>
                      </div>

                      <p className="flex items-center gap-2 text-[11px] text-gray-400 mb-4 font-medium italic">
                        <MapPin size={12} className="text-red-600" /> {branch.address}
                      </p>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Hội viên</p>
                          <div className="flex items-center gap-1.5 font-black text-sm">
                            <Users size={14} className="text-red-500" /> {branch.members}
                          </div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5 text-center">
                          <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Tình trạng</p>
                          <span className={`text-[9px] font-black uppercase ${branch.status === 'Đang hoạt động' ? 'text-green-500' : 'text-yellow-500'}`}>
                            {branch.status}
                          </span>
                        </div>
                        <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <p className="text-[8px] text-gray-500 font-black uppercase mb-1">Độ lấp đầy</p>
                          <div className="flex items-center gap-1.5 font-black text-sm">
                            <Activity size={14} className="text-blue-400" /> {branch.load}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold">
                        <Phone size={12} /> {branch.phone}
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors">
                        Chi tiết vận hành <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Thống kê nhanh footer */}
        <div className="mt-12 flex gap-8 justify-center opacity-50">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <CheckCircle2 size={14} className="text-green-500"/> 02 Chi nhánh Online
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <Clock size={14} className="text-yellow-500"/> 01 Đang bảo trì
           </div>
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
              <AlertCircle size={14} className="text-red-500"/> 00 Sự cố kỹ thuật
           </div>
        </div>
      </div>
    </main>
  );
};

export default Branch;