import React, { useState, useEffect } from 'react';
import classApi from './api/classAPI';

const Booking = () => {
  const [filterType, setFilterType] = useState('All');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await classApi.getAll();
        setClasses(response.data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses = filterType === 'All' ? classes : classes.filter(c => c.type === filterType);

  return (
    <div className="p-4 md:p-10 bg-[#f4f4f5] min-h-screen text-black font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-[0.28em] mb-2">
            Lịch <span className="text-[#d03030]">Lớp Học</span>
          </h2>
          <p className="text-gray-500 font-light">Đặt chỗ trước để đảm bảo không gian tập luyện tốt nhất.</p>
        </div>

        <select
          className="w-full md:w-auto bg-white border border-gray-300 rounded-2xl px-4 py-3 shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#d03030]/30 focus:border-[#d03030] transition"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">Tất cả dịch vụ</option>
          <option value="Yoga">Yoga</option>
          <option value="Group X">Group X (Nhảy, Đạp xe...)</option>
          <option value="Gym">Gym / HIIT</option>
        </select>
      </div>

      <div className="bg-white rounded-[16px] shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
            <thead className="bg-gray-100 text-gray-600 text-xs uppercase tracking-[0.18em] font-bold">
              <tr>
                <th className="py-4 px-6">Lớp học / HLV</th>
                <th className="py-4 px-6">Thời gian</th>
                <th className="py-4 px-6">Tình trạng chỗ</th>
                <th className="py-4 px-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">Đang tải dữ liệu lớp học...</td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">Không có lớp học nào</td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                  <tr key={cls.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-6 align-top">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                          {cls.type === 'Yoga' ? '🧘‍♀️' : cls.type === 'Group X' ? '💃' : '🏋️'}
                        </div>
                        <div>
                          <h6 className="text-base font-semibold uppercase tracking-[0.08em] mb-1">{cls.name}</h6>
                          <p className="text-sm text-gray-500">HLV {cls.trainer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6 align-top">
                      <p className="font-semibold">{cls.time}</p>
                      <p className="text-sm text-gray-500">{cls.date}</p>
                    </td>
                    <td className="py-5 px-6 align-top">
                      {cls.slots > 0 ? (
                        <div className="space-y-2">
                          <span className="inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-700">Còn {cls.slots} chỗ</span>
                          <div className="h-1.5 w-20 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${((cls.total - cls.slots) / cls.total) * 100}%` }}></div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Đã Kín Chỗ</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right align-top">
                      <button
                        className={`rounded-2xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition ${cls.slots > 0 ? 'bg-black text-white hover:bg-[#d03030]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                        disabled={cls.slots === 0}
                      >
                        {cls.slots > 0 ? 'Đặt ngay' : 'Hết chỗ'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Booking;