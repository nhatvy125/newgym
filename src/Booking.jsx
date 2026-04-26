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
    <div className="p-4 p-md-5 bg-[#f4f4f5] min-h-screen text-black font-sans">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h2 className="display-6 fw-bold text-uppercase tracking-widest mb-2">
            Lịch <span className="text-[#d03030]">Lớp Học</span>
          </h2>
          <p className="text-gray-500 font-light m-0">Đặt chỗ trước để đảm bảo không gian tập luyện tốt nhất.</p>
        </div>
        
        {/* Bộ lọc loại lớp */}
        <select 
          className="form-select w-auto bg-white border-gray-300 rounded-0 shadow-sm px-4 py-2 cursor-pointer focus:ring-[#d03030] focus:border-[#d03030]"
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
        <div className="table-responsive">
          <table className="table table-hover align-middle m-0">
            <thead className="table-dark uppercase tracking-widest text-xs">
              <tr>
                <th className="py-4 ps-4 fw-medium">Lớp học / HLV</th>
                <th className="py-4 fw-medium">Thời gian</th>
                <th className="py-4 fw-medium">Tình trạng chỗ</th>
                <th className="py-4 pe-4 text-end fw-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Đang tải dữ liệu lớp học...</td>
                </tr>
              ) : filteredClasses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Không có lớp học nào</td>
                </tr>
              ) : (
                filteredClasses.map((cls) => (
                <tr key={cls.id} className="transition-colors hover:bg-gray-50">
                  <td className="py-4 ps-4">
                    <div className="d-flex align-items-center gap-3">
                      <div className="w-[50px] h-[50px] bg-gray-100 rounded-circle flex items-center justify-center text-xl">
                        {cls.type === 'Yoga' ? '🧘‍♀️' : cls.type === 'Group X' ? '💃' : '🏋️'}
                      </div>
                      <div>
                        <h6 className="fw-bold m-0 text-lg uppercase tracking-wide">{cls.name}</h6>
                        <span className="text-sm text-gray-500">Master {cls.trainer}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <p className="m-0 fw-bold">{cls.time}</p>
                    <span className="text-sm text-gray-500">{cls.date}</span>
                  </td>
                  <td className="py-4">
                    {cls.slots > 0 ? (
                      <div>
                        <span className="badge bg-success/10 text-success rounded-pill px-3 py-2 text-xs uppercase tracking-widest border border-success/20">Còn {cls.slots} chỗ</span>
                        <div className="progress mt-2" style={{ height: '4px', width: '80px' }}>
                          <div className="progress-bar bg-success" style={{ width: `${(cls.total - cls.slots) / cls.total * 100}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <span className="badge bg-danger/10 text-danger rounded-pill px-3 py-2 text-xs uppercase tracking-widest border border-danger/20">Đã Kín Chỗ</span>
                    )}
                  </td>
                  <td className="py-4 pe-4 text-end">
                    <button 
                      className={`btn rounded-0 px-4 py-2 uppercase fw-bold tracking-widest text-xs transition-all ${cls.slots > 0 ? 'bg-black text-white hover:bg-[#d03030]' : 'btn-light text-gray-400 cursor-not-allowed'}`}
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