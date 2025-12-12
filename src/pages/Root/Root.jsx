import React from 'react';
import Navbar from '../../components/Header/Navbar';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';
import { Outlet } from 'react-router';
import { ToastContainer } from 'react-toastify';

const Root = () => {
  return (
    <div className="drawer lg:drawer-open">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col min-h-screen bg-base-200">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-50">
        <label htmlFor="main-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <Sidebar />
      </div>

      <ToastContainer />
    </div>
  );
};

export default Root;