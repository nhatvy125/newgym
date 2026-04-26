import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import Homepage from './Homepage';
import Login from './Login';
import AppLayout from './AppLayout'; 
import MemberDashboard from './MemberDashboard'; 
import MemberManagement from './MemberManagement';
import Schedule from './Schedule'; // <--- IMPORT COMPONENT MỚI Ở ĐÂY
import Booking from './Booking'; 
import Packages from './Packages'; 
import Setting from './Setting';
import Branch from './Branch';

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const isTokenValid = (token) => {
  if (!token || token === 'null' || token === 'undefined') return false;
  const payload = parseJwt(token);
  return payload?.exp ? Date.now() < payload.exp * 1000 : true;
};

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />

        {/* =========================================
            KHU VỰC ADMIN (Có thanh menu đen bên trái) 
            ========================================= */}
        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/dashboard" element={<MemberDashboard />} /> 
          <Route path="/members" element={<MemberManagement />} />
          
          {/* CẬP NHẬT ROUTE CHO LỊCH HỌC TẠI ĐÂY */}
          <Route path="/schedule" element={<Schedule />} /> 
          
          <Route path="/packages-admin" element={<Packages />} />
          <Route path="/branches" element={<Branch />} />
          <Route path="/settings" element={<Setting />} />
        </Route> 

        {/* =========================================
            KHU VỰC KHÁCH/HỘI VIÊN (Không có menu đen)
            ========================================= */}
        <Route path="/member-booking" element={<Booking />} />
        <Route path="/member-packages" element={<Packages />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
// import { useEffect, useState } from 'react';

// function App() {
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     // Gọi đến địa chỉ mặc định của Spring Boot
//     fetch("http://localhost:8080/")
//       .then((response) => response.text())
//       .then((data) => {
//         setMessage(data);
//       })
//       .catch((error) => console.error("Lỗi kết nối:", error));
//   }, []);
// ß
//   return (
//     <div className="p-10 text-center">
//       <h1 className="text-2xl font-bold">TwelveFit System</h1>
//       <p className="mt-4 text-blue-600">Backend says: {message}</p>
//     </div>
//   );
// }

// export default App;