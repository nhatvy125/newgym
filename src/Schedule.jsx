import React, { useState, useEffect } from 'react'; // 1. Thêm useState, useEffect
import classApi from "./api/classAPI";
import { 
  Users, Calendar, Clock, MapPin, Filter, Search, Bell, ChevronLeft, ChevronRight, PlusCircle 
} from 'lucide-react';

// Component thẻ lớp học chi tiết
function ClassCard({ time, name, instructor, studio, enrolled }) {
  return (
    <div className="absolute inset-1 bg-red-600/20 backdrop-blur-md border border-red-500/30 rounded-xl p-2.5 text-white flex flex-col justify-between group hover:bg-red-600/40 hover:scale-[1.02] transition-all cursor-pointer shadow-lg shadow-red-900/20 z-10">
      <div>
        <div className="flex justify-between items-start mb-1">
          <span className="font-black text-[10px] uppercase tracking-tighter leading-none bg-red-600 px-1.5 py-0.5 rounded shadow-sm">
            {name}
          </span>
          <button className="text-white/50 hover:text-white transition-colors">•••</button>
        </div>
        <p className="text-[9px] flex gap-1 items-center font-medium text-red-200 mt-1">
          <Clock size={10} /> {time}
        </p>
      </div>
      
      <div className="mt-auto">
        <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[8px] font-bold">
                {instructor?.split(' ').pop().charAt(0) || 'U'}
            </div>
            <span className="text-[9px] font-medium text-gray-200 truncate">{instructor}</span>
        </div>
        <div className="flex justify-between items-end border-t border-white/10 pt-1 mt-1">
          <span className="text-[8px] flex gap-1 items-center text-gray-400 font-bold uppercase">
            <MapPin size={10} /> {studio}
          </span>
          <span className="text-[9px] font-black text-white">{enrolled}</span>
        </div>
      </div>
    </div>
  );
}

export default function Schedule() {
  // 2. Khai báo state để lưu danh sách lớp học từ Backend
  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  const timeSlots = Array.from({ length: 15 }, (_, i) => `${7 + i}:00`);

  const getDayLabel = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][date.getDay()];
  };

  const getHour = (timeString) => {
    if (!timeString) return null;
    return parseInt(timeString.split(":")[0], 10);
  };

  // 3. Hàm gọi API
  useEffect(() => {
    const loadClasses = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await classApi.getAll();
        const mappedClasses = response.data.map((cls) => ({
          ...cls,
          day: getDayLabel(cls.date),
          time: cls.startTime ? cls.startTime.slice(0, 5) : '',
          instructor: cls.trainerName || cls.trainer?.username || 'Chưa rõ',
          enrolled: cls.currentCapacity ?? 0,
          studio: cls.studio || 'Không rõ',
          name: cls.name || 'Lớp mới',
        }));
        setClassList(mappedClasses);
      } catch (error) {
        console.error("Không thể lấy lịch học từ server:", error);
        setError(error.response?.data?.message || "Không thể tải lịch học từ server.");
      } finally {
        setLoading(false);
      }
    };
    loadClasses();
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
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[3px]"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-black/20 backdrop-blur-sm">
          <div>
            <h1 className="text-2xl font-black tracking-widest uppercase italic">
              Lịch học <span className="text-red-600">Hệ Thống</span>
            </h1>
            <p className="text-[10px] text-gray-500 mt-1 font-black uppercase tracking-[0.2em]">TwelveFit Scheduler v2.0</p>
          </div>

          <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl focus-within:border-red-600 transition-all">
                <Search size={18} className="text-gray-500" />
                <input type="text" placeholder="Tìm lớp..." className="bg-transparent border-none focus:outline-none text-sm w-32 font-medium text-white placeholder:text-gray-600" />
              </div>
              <button className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all active:scale-95">
                <PlusCircle size={16} /> Thêm Lịch
              </button>
          </div>
        </header>

        <div className="px-8 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex gap-3">
                <select className="bg-black/40 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg outline-none focus:border-red-600">
                    <option>Tất cả chi nhánh</option>
                </select>
                <select className="bg-black/40 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg outline-none focus:border-red-600">
                    <option>Studio A</option>
                    <option>Studio B</option>
                </select>
            </div>

            <div className="flex gap-4 items-center">
                <button className="p-2 bg-white/5 hover:bg-red-600 rounded-lg transition-all"><ChevronLeft size={16}/></button>
                <span className="text-xs font-black uppercase tracking-widest">Tuần hiện tại</span>
                <button className="p-2 bg-white/5 hover:bg-red-600 rounded-lg transition-all"><ChevronRight size={16}/></button>
            </div>
        </div>

        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {loading && (
            <div className="p-8 text-center text-gray-300">Đang tải lịch học...</div>
          )}
          {error && (
            <div className="p-8 text-center text-red-400">{error}</div>
          )}
          {!loading && !error && classList.length === 0 && (
            <div className="p-8 text-center text-gray-400">Chưa có lịch học để hiển thị.</div>
          )}
          <div className="min-w-[1000px] bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="grid grid-cols-8">
              <div className="col-span-1 border-r border-white/5">
                <div className="h-14 border-b border-white/5 bg-white/5 flex items-center justify-center">
                    <Clock size={16} className="text-gray-500" />
                </div>
                {timeSlots.map((slot) => (
                  <div key={slot} className="h-24 flex justify-center items-center text-[10px] font-black text-gray-500 border-b border-white/5 italic">{slot}</div>
                ))}
              </div>

              {daysOfWeek.map((day) => (
                <div key={day} className="col-span-1 border-r border-white/5 last:border-r-0">
                  <div className="h-14 border-b border-white/10 bg-white/5 flex flex-col items-center justify-center">
                      <span className="font-black text-xs text-white uppercase tracking-tighter">{day}</span>
                  </div>
                  
                  <div className="relative">
                    {timeSlots.map((slot) => {
                      const classesInSlot = classList.filter(
                        (cls) => cls.day === day && getHour(cls.time) === parseInt(slot, 10)
                      );
                      return (
                        <div key={`${day}-${slot}`} className="h-24 border-b border-white/5 relative group transition-colors hover:bg-white/[0.02]">
                            {classesInSlot.map((cls) => (
                                <ClassCard key={cls.id} {...cls} />
                            ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}