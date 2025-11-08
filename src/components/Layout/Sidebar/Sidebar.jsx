import React, { useState } from 'react';
import { Link, NavLink, useRouteLoaderData } from 'react-router';

const Sidebar = ({collapsed}) => {
    const menus = useRouteLoaderData('root')
    const [openMenuId, setOpenMenuId] = useState(null);
    const handleToggle = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };
    return (
        <div className={`drawer drawer-open overflow-auto transition-all ease-in-out ${collapsed ? 'hidden' : 'fixed inset-0 z-40'} md:relative md:inset-auto md:z-auto `}>
            <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">


            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>

                <ul className="menu bg-base-200 min-h-full w-60 p-4 py-10 space-y-10">
                    <div className='flex flex-col justify-center items-center py-5'>
                        <h1>user</h1>
                        <p>user role</p>
                    </div>
                   <nav className='flex flex-col space-y-5 w-full px-2'>
                    {menus && menus.map(m => {
                        const isCurrentMenuOpen = openMenuId === m.id;

                        return (
                            <div key={m.id} className='w-full text-xl '>
                                
                                {m.isSubMenu ? (
                                    // === SUBMENU ITEM (Uses button and toggle) ===
                                    <div className='w-full'>
                                        <div className='flex items-center px-5 py-2 gap-2 hover:bg-amber-400 rounded-lg'>
                                            <img className='w-1/10' src={m.icon} alt="" />
                                        <button className=' flex justify-center items-center' onClick={() => handleToggle(m.id)}>
                                            
                                            <span className='mr-2'>{m.title}</span>
                                            {/* Icon to indicate expansion state */}
                                            <span className="ml-auto transform transition-transform duration-200">
                                                {isCurrentMenuOpen ? '▲' : '▼'}
                                            </span>
                                        </button>

                                        </div>
                                        {/* Collapsible Submenu Container - THIS CREATES THE SPACE */}
                                        <div
                                            className={`
                                                overflow-hidden transition-all duration-300 ease-in-out
                                                ${isCurrentMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                                            `}
                                        >
                                            <div className="pl-4 pt-2 space-y-5 flex flex-col items-center">
                                                {m.subMenu.map(subM => (
                                                    <NavLink className={'hover:bg-amber-400 rounded-lg p-2'} key={subM.id} 
                                                        to={subM.path}>
                                                        {subM.title}
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                ) : (
                                    // === REGULAR MENU ITEM ===
                                    
                                        <NavLink className='flex gap-5 items-center hover:bg-amber-400 rounded-lg px-5 py-2' to={m.path}>
                                         <img className='w-1/10' src={m.icon} alt="" />
                                        {m.title}
                                    </NavLink>
                                    
                                )}
                            </div>
                        );
                    })}
                </nav>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;