import React from 'react';
import { Link } from 'react-router';
import { FaAlignJustify, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm sticky top-0 z-40">
      <div className="flex-none lg:hidden">
        <label htmlFor="main-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
          <FaAlignJustify className="inline-block h-6 w-6 stroke-current" />
        </label>
      </div>
      <div className="flex-1">
        <Link to={'/'} className='btn btn-ghost text-xl font-semibold flex items-center gap-2'>
          <img className='w-8' src="https://img.icons8.com/?size=100&id=vLoyKUoYhPuX&format=png&color=000000" alt="TCBR Logo" />
          <span className="hidden sm:inline">TCBR</span>
        </Link>
      </div>
      <div className="flex-none">
        {/* Example User Menu */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <FaUserCircle className="w-full h-full text-gray-500" />
            </div>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;