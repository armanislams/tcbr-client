import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Header/Navbar';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';
import { Outlet, useLocation } from 'react-router';
import { ToastContainer } from 'react-toastify';

const Root = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation()
  // Auto collapse sidebar on small screens
  useEffect(() => {
    const handleResponsiveSidebar = () => {
      // Always collapse on mobile
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
      // Always expand on desktop
      else {
        setCollapsed(false);
      }
    };

    // Run when mounted
    handleResponsiveSidebar();

    // Listen for screen resize
    window.addEventListener("resize", handleResponsiveSidebar);

    // Cleanup
    return () => window.removeEventListener("resize", handleResponsiveSidebar);

    // Also re-run on route change
  }, [location.pathname]);

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="flex bg-gray-100">
      <div className="sticky top-0 h-fit">
        <Sidebar collapsed={collapsed}></Sidebar>
      </div>
      <div className="lg:w-[100vw] ">
        <Navbar handleToggleCollapsed={handleToggleCollapsed}></Navbar>
        <main className="pt-4">
          <Outlet />
        </main>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default Root;