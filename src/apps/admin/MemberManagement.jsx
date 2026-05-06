import React, { useState, useEffect } from 'react';
import { Search, Filter, Lock, Edit2, Eye, UserPlus, Trash2, Plus } from 'lucide-react';
import memberApi from '../../api/memberAPI';

const MemberManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAccount, setNewAccount] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'USER',
  });

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await memberApi.getAll({ page: 0, size: 50 });
        const data = response.data?.content || response.data || [];
        setMembers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        if (err.response?.status === 401) {
          setError('Chưa đăng nhập hoặc token hết hạn. Hãy đăng nhập lại.');
        } else {
          setError('Không thể tải danh sách người dùng.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa người dùng này không?')) return;

    try {
      await memberApi.delete(id);
      setMembers((prev) => prev.filter((member) => member.id !== id));
      alert('Xóa người dùng thành công!');
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMsg = err.response?.data?.message || err.response?.data || 'Xóa thất bại';
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const handleEdit = async (member) => {
    const email = window.prompt('Email', member.email || '');
    if (email == null) return;

    const fullName = window.prompt('Họ và tên', member.fullName || member.username);
    if (fullName == null) return;

    const roleInput = window.prompt('Vai trò (ADMIN/USER)', member.role || 'USER');
    if (roleInput == null) return;
    const role = roleInput.trim().toUpperCase();
    if (!['ADMIN', 'USER'].includes(role)) {
      alert('Vai trò không hợp lệ. Vui lòng nhập ADMIN hoặc USER.');
      return;
    }

    const changePassword = window.confirm('Bạn có muốn thay đổi mật khẩu không?');
    let passwordHash = null;
    if (changePassword) {
      passwordHash = window.prompt('Mật khẩu mới (để trống để giữ nguyên)');
    }

    try {
      const updateData = { email, fullName, role };
      if (passwordHash) {
        updateData.passwordHash = passwordHash;
      }
      const response = await memberApi.update(member.id, updateData);
      setMembers((prev) => prev.map((item) => item.id === member.id ? { ...item, ...response.data } : item));
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Update failed:', err);
      const errorMsg = err.response?.data?.message || err.response?.data || 'Cập nhật thất bại';
      alert(`Lỗi: ${errorMsg}`);
    }
  };

  const handleCreate = async () => {
    if (!newAccount.username || !newAccount.email || !newAccount.password || !newAccount.fullName) {
      alert('Vui lòng điền đầy đủ thông tin tài khoản.');
      return;
    }

    const role = newAccount.role.trim().toUpperCase();
    if (!['ADMIN', 'USER'].includes(role)) {
      alert('Vai trò không hợp lệ. Vui lòng chọn ADMIN hoặc USER.');
      return;
    }

    setCreating(true);
    try {
      const response = await memberApi.create({
        username: newAccount.username.trim(),
        password: newAccount.password,
        email: newAccount.email.trim(),
        fullName: newAccount.fullName.trim(),
        role,
      });
      setMembers((prev) => [response.data, ...prev]);
      setNewAccount({ username: '', email: '', password: '', fullName: '', role: 'USER' });
      setShowCreateForm(false);
      alert(`Tạo tài khoản ${role === 'ADMIN' ? 'ADMIN' : 'USER'} thành công!`);
    } catch (err) {
      console.error('Create failed:', err);
      const errorMsg = err.response?.data?.message || err.response?.data || 'Tạo tài khoản thất bại';
      alert(`Lỗi: ${errorMsg}`);
    } finally {
      setCreating(false);
    }
  };

  const filteredMembers = members.filter((member) => {
    const query = search.toLowerCase();
    const roleValue = (member.role || 'USER').toUpperCase();
    const matchesRole = roleFilter === 'ALL' || roleValue === roleFilter;
    return (
      matchesRole &&
      (
        member.username?.toLowerCase().includes(query) ||
        member.fullName?.toLowerCase().includes(query) ||
        member.email?.toLowerCase().includes(query)
      )
    );
  });

  return (
    <main className="flex-1 flex flex-col h-screen overflow-hidden font-sans relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/bgmemdash.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10 flex-1 overflow-auto p-8 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h3 className="text-3xl font-black uppercase tracking-widest text-white italic m-0">
              Quản lý <span className="text-red-600">Tài Khoản</span>
            </h3>
            <p className="mt-2 text-sm text-gray-400">Danh sách admin và user hiện có trong hệ thống</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={() => { setShowCreateForm((prev) => !prev); setNewAccount((prev) => ({ ...prev, role: 'USER' })); }}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] active:scale-95"
            >
              <Plus size={18} /> Tạo tài khoản mới
            </button>
            <button
              onClick={() => { setShowCreateForm(true); setNewAccount((prev) => ({ ...prev, role: 'ADMIN' })); }}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(15,23,42,0.3)] active:scale-95"
            >
              <Plus size={18} /> Tạo admin
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold text-white">Tạo tài khoản mới</h4>
                <p className="text-sm text-gray-400">Tạo tài khoản ADMIN hoặc USER cho hệ thống.</p>
              </div>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-xs uppercase tracking-[0.3em] text-gray-300 hover:text-white"
              >
                Đóng
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <input
                type="text"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Username"
              />
              <input
                type="text"
                value={newAccount.fullName}
                onChange={(e) => setNewAccount({ ...newAccount, fullName: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Họ và tên"
              />
              <input
                type="email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Email"
              />
              <input
                type="password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
                placeholder="Mật khẩu"
              />
              <select
                value={newAccount.role}
                onChange={(e) => setNewAccount({ ...newAccount, role: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="rounded-2xl bg-red-600 px-6 py-3 font-black uppercase tracking-[0.2em] text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Đang tạo...' : 'Tạo tài khoản'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-2xl border border-white/10 px-6 py-3 font-black uppercase tracking-[0.2em] text-white hover:bg-white/5"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-red-600/50 transition-all placeholder:text-gray-600"
              placeholder="Tìm theo tên, username hoặc email..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-auto bg-black/20 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
            <button className="flex items-center gap-2 justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs uppercase tracking-widest text-white transition hover:border-red-500 hover:text-red-500">
              <Filter size={16} /> Lọc
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/20 backdrop-blur-2xl">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-white/5 text-[11px] text-gray-400 uppercase font-black tracking-[0.2em] border-b border-white/10">
                <th className="p-6">ID</th>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th className="text-center p-6">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Đang tải danh sách người dùng...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-red-400">{error}</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">Không tìm thấy người dùng phù hợp.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="p-6 font-black text-red-500/80 group-hover:text-red-500 transition-colors">#{member.id}</td>
                    <td>
                      <div className="font-bold text-gray-100">{member.fullName || member.username || 'Không rõ'}</div>
                      <div className="text-[11px] text-gray-500 italic">{member.username}</div>
                    </td>
                    <td>
                      <div className="text-gray-200 text-sm">{member.email || 'Không có email'}</div>
                    </td>
                    <td>
                      <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs font-bold text-gray-300 uppercase">
                        {member.role || 'USER'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        member.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                        member.status === 'INACTIVE' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' :
                        member.status === 'EXPIRED' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                      }`}>
                        {member.status || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex justify-center gap-3">
                        <button className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-gray-400 hover:bg-white/10 hover:text-blue-400 transition-all active:scale-90">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEdit(member)} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-gray-400 hover:bg-white/10 hover:text-yellow-300 transition-all active:scale-90">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-gray-400 hover:bg-white/10 hover:text-red-500 transition-all active:scale-90">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="p-6 border-t border-white/5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-gray-500 font-bold uppercase tracking-widest">
            <span>Hiển thị {members.length} người dùng</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white/5 rounded-md hover:bg-red-600 hover:text-white transition-all">Trước</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-md shadow-lg shadow-red-600/20">1</button>
              <button className="px-3 py-1 bg-white/5 rounded-md hover:bg-red-600 hover:text-white transition-all">Sau</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MemberManagement;
