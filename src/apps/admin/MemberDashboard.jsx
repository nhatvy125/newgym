import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, DollarSign, CheckSquare, Search, Bell 
} from 'lucide-react';
import classApi from '../../api/classAPI';
import invoiceApi from '../../api/invoiceAPI';

export default function TwelveFitDashboard() {
  const [classList, setClassList] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [classResponse, invoiceResponse] = await Promise.all([
          classApi.getAll(),
          invoiceApi.getAll(),
        ]);

        const mappedClasses = classResponse.data.map((cls) => ({
          ...cls,
          day: getDayLabel(cls.date),
          time: cls.startTime ? cls.startTime.slice(0, 5) : '',
          instructor: cls.trainerName || cls.trainer?.fullName || cls.trainer?.username || 'Chưa rõ',
          enrolled: cls.currentCapacity ?? 0,
          studio: cls.studio || 'Không rõ',
          name: cls.name || 'Lớp mới',
        }));

        setClassList(mappedClasses);
        setInvoiceList(invoiceResponse.data || []);
      } catch (error) {
        console.error('Không thể tải dữ liệu dashboard:', error);
        setError(error.response?.data?.message || 'Lỗi khi tải dữ liệu quản lý.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalRevenue = invoiceList
    .filter((invoice) => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + Number(invoice.price || 0), 0);

  const pendingCount = invoiceList.filter((invoice) => invoice.status === 'PENDING').length;
  const paidCount = invoiceList.filter((invoice) => invoice.status === 'PAID').length;
  const activeMemberships = invoiceList.filter((invoice) => {
    if (!invoice.expiredDate || invoice.status !== 'PAID') return false;
    return new Date(invoice.expiredDate) > new Date();
  }).length;

  const topInvoices = invoiceList.slice(0, 5);

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden font-sans relative text-white">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bgmemdash.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"></div>
      </div>

      <header className="relative z-10 bg-black/30 backdrop-blur-md px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 text-white gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Bảng điều khiển Hóa đơn & Doanh thu</h1>
          <p className="text-sm text-gray-400 mt-1 italic">Theo dõi doanh thu, trạng thái hóa đơn và doanh thu định kỳ cho Admin.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-red-600 transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm hóa đơn hoặc hội viên..." 
              className="bg-transparent border-none focus:outline-none text-sm w-48 text-white placeholder:text-gray-500" 
            />
          </div>
          <div className="relative cursor-pointer hover:scale-110 transition-transform">
            <Bell size={20} className="text-gray-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full border border-black"></span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer border border-white/20 p-1 rounded-full bg-white/5">
            <img src="https://i.pravatar.cc/150?img=12" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Tổng hóa đơn" value={invoiceList.length.toString()} trend={`${paidCount} đã thanh toán`} />
          <StatCard icon={DollarSign} title="Doanh thu đã thu" value={`${totalRevenue.toLocaleString('vi-VN')} ₫`} trend="Cập nhật realtime" />
          <StatCard icon={Calendar} title="Hóa đơn chờ" value={pendingCount.toString()} trend="Thực hiện xác nhận" trendColor="text-yellow-400" />
          <StatCard icon={CheckSquare} title="Hội viên active" value={activeMemberships.toString()} trend="Theo hóa đơn PAID" />
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-300">Đang tải dữ liệu dashboard...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-black/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/10 text-white">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="font-bold text-lg uppercase tracking-widest text-red-500">Hóa đơn gần nhất</h2>
                  <p className="text-[11px] text-gray-400 mt-1">Xem tất cả hóa đơn mua gói hội viên và trạng thái thanh toán.</p>
                </div>
                <button className="text-xs font-bold text-gray-400 hover:text-white border border-white/10 px-3 py-1 rounded-full transition-all">XEM TẤT CẢ</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] text-gray-500 border-b border-white/5 uppercase font-black">
                      <th className="pb-4">Khách hàng</th>
                      <th className="pb-4">Gói dịch vụ</th>
                      <th className="pb-4">Số tiền</th>
                      <th className="pb-4">Thanh toán</th>
                      <th className="pb-4">Trạng thái</th>
                      <th className="pb-4">Ngày</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {topInvoices.map((invoice) => (
                      <InvoiceRow key={invoice.id} invoice={invoice} />
                    ))}
                    {topInvoices.length === 0 && (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-400">Chưa có hóa đơn để hiển thị.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-2xl rounded-3xl p-7 shadow-2xl border border-white/10 text-white flex flex-col">
              <h2 className="font-bold text-lg mb-6 uppercase tracking-widest text-red-500">Lịch học sắp tới</h2>
              <div className="space-y-4 flex-1">
                {classList.slice(0, 3).map((cls) => (
                  <ClassItem 
                    key={cls.id}
                    time={cls.time}
                    name={cls.name}
                    studio={`${cls.studio} · ${cls.enrolled}/${cls.maxCapacity ?? 0} HV`} 
                  />
                ))}
              </div>
              <button className="w-full mt-8 bg-red-600 text-white font-black text-xs py-4 rounded-2xl hover:bg-red-700 transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] active:scale-95 uppercase tracking-widest">
                Quản lý lịch học
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, title, value, trend, trendColor = 'text-green-400' }) {
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

function InvoiceRow({ invoice }) {
  const statusClass = invoice.status === 'PAID' ? 'text-green-400' : invoice.status === 'PENDING' ? 'text-yellow-400' : 'text-red-400';

  return (
    <tr className="border-b border-white/5 last:border-none hover:bg-white/5 transition-colors">
      <td className="py-5 font-bold text-gray-200">{invoice.username}</td>
      <td className="py-5 text-gray-400 italic text-xs">{invoice.packageName}</td>
      <td className="py-5 text-white font-black">{Number(invoice.price || 0).toLocaleString('vi-VN')} ₫</td>
      <td className="py-5 text-gray-300 uppercase text-[10px] tracking-[0.25em] font-black">{invoice.paymentMethod}</td>
      <td className={`py-5 uppercase text-[10px] tracking-[0.25em] font-black ${statusClass}`}>{invoice.status}</td>
      <td className="py-5 text-gray-400 text-[10px]">{invoice.paymentDate ? new Date(invoice.paymentDate).toLocaleDateString('vi-VN') : 'Chưa thanh toán'}</td>
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

function getDayLabel(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
}
