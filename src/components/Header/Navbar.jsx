import React from 'react';
import { Link } from 'react-router';
import { AiOutlineMenu } from 'react-icons/ai';
import { FaAlignJustify } from 'react-icons/fa';

const Navbar = ({handleToggleCollapsed}) => {
    return (
      <div className="navbar z-40 relative">
  <div className="navbar bg-base-100 shadow-sm">
  <div className="navbar-start flex justify-items-start gap-5 lg:px-5 items-center ">
   <button className='btn border-none drawer-button' onClick={handleToggleCollapsed}> <label htmlFor="my-drawer-3" className=" drawer-button">
    <FaAlignJustify/>
    </label></button>
      <Link to={'/'} className='text-xl font-semibold flex items-center gap-2'>
     <img className='w-1/4' src="https://img.icons8.com/?size=100&id=vLoyKUoYhPuX&format=png&color=000000" alt="" />
     <h2>TCBR</h2></Link>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      <li><a>Item 1</a></li>
      <li>
        <details>
          <summary>Parent</summary>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>Item 3</a></li>
    </ul>
  </div>
  <div className="navbar-end">
     <div className="dropdown dropdown-center">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
  </div>
</div>
</div>
    );
};

export default Navbar;