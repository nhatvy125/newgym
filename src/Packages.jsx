import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, Plus, Zap, Star, Crown, Settings2 } from 'lucide-react';
import packageApi from './api/packageAPI';

const Packages = () => {
  const [billingCycle, setBillingCycle] = useState('month');
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await packageApi.getAll();
        setPackages(response.data);
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        if (error.response?.status === 401) {
          setError('Chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.');
        } else {
          setError('Không thể tải dữ liệu gói tập. Vui lòng thử lại.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden font-sans relative text-white">
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

      <div className="relative z-10 flex-1 overflow-auto p-8 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-wider">
              Thiết lập <span className="text-red-600">Gói Dịch Vụ</span>
            </h2>
            <div className="h-1 w-20 bg-red-600 mt-2 rounded-full mb-4"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Quản lý giá và quyền lợi các gói hội viên trên hệ thống</p>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="inline-flex bg-white/5 backdrop-blur-md p-1 rounded-xl border border-white/10">
              <button
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${billingCycle === 'month' ? 'bg-red-600' : 'text-gray-500'}`}
                onClick={() => setBillingCycle('month')}
              >Xem giá Tháng</button>
              <button
                className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${billingCycle === 'year' ? 'bg-red-600' : 'text-gray-500'}`}
                onClick={() => setBillingCycle('year')}
              >Xem giá Năm</button>
            </div>

            <button className="flex items-center gap-2 bg-white text-black hover:bg-red-600 hover:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
              <Plus size={18} /> Tạo gói mới
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {loading ? (
            <div className="col-span-full text-center text-gray-400 py-8">Đang tải dữ liệu gói tập...</div>
          ) : error ? (
            <div className="col-span-full text-center text-red-400 py-8">{error}</div>
          ) : packages.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">Không có dữ liệu gói tập</div>
          ) : (
            packages.map((pkg) => (
              <div
                key={pkg.id}
                className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 transition-all hover:border-red-600/50 shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${pkg.highlight ? 'bg-red-600/20 border-red-600 text-red-500' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                    {pkg.status}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-blue-600 transition-colors"><Edit3 size={14}/></button>
                    <button className="p-2 bg-white/5 rounded-lg hover:bg-red-600 transition-colors"><Trash2 size={14}/></button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${pkg.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{pkg.name}</h3>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 mb-6 border border-white/5">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Giá hiển thị:</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{pkg.price}</span>
                    <span className="text-red-500 font-black text-lg italic">₫</span>
                    <span className="text-gray-500 text-[10px] font-bold uppercase ml-1">/ {billingCycle}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-3">Quyền lợi gói:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feat, i) => (
                      <span key={i} className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-gray-300">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  <Settings2 size={16} /> Cấu hình chi tiết
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default Packages;
