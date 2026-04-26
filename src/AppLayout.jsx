import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 

const AppLayout = () => {
  return (
    // Thêm style cứng display: 'flex' vào đây
    <div style={{ display: 'flex' }} className="h-screen w-full bg-gray-50 overflow-hidden">
      
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-auto">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AppLayout;