import React, { useState } from 'react';
import { BASE_URL } from '@/api/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  // Đã thêm Type cho sự kiện (e) để TypeScript không báo lỗi dòng đỏ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('Đang xử lý...');

    try {
      // Gọi sang Backend cổng 8081
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), 
      });

      if (response.status === 201 || response.ok) { 
        const data = await response.json();
        setMessage(`✅ Đăng ký thành công User: ${data.username || formData.username}!`);
      } else {
        setMessage('❌ Đăng ký thất bại. Có thể username/email đã tồn tại!');
      }
    } catch (error) {
      console.error('Lỗi kết nối:', error);
      setMessage('❌ Không thể kết nối đến máy chủ Backend!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Đăng ký thành viên Gym</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Tên đăng nhập</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="Nhập username..." />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="Nhập email..." />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" placeholder="Nhập mật khẩu..." />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            Đăng ký ngay
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 text-center rounded bg-gray-50 border border-gray-200 text-gray-800 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}