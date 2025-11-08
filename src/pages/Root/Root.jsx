import React, { useState } from 'react';
import Navbar from '../../components/Header/Navbar';
import Sidebar from '../../components/Layout/Sidebar/Sidebar';
import { Outlet } from 'react-router';

const Root = () => {
    const [collapsed, setCollapsed] = useState(false)
    const handleToggleCollapsed= ()=>{
        setCollapsed(!collapsed);
    }
    return (
        <div className='flex bg-gray-100'>
                    <div className='sticky top-0 h-fit'>
                        <Sidebar collapsed={collapsed}></Sidebar>
                    </div>
                    <div className='w-[100vw] '>
                        <Navbar handleToggleCollapsed={handleToggleCollapsed}></Navbar>
                        <main className='pt-4'>
                    <Outlet />
                </main>
                    </div>
        </div>
    );
};

export default Root;