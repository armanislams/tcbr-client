import React from "react";
import { NavLink } from "react-router";
import { FaThLarge, FaList, FaPlusCircle, FaHome } from "react-icons/fa";

const Sidebar = () => {
  const menuItems = [
    { title: "Dashboard", path: "/dashboard", icon: <FaThLarge /> },
    { title: "Booking List", path: "/booking-list", icon: <FaList /> },
    { title: "New Booking", path: "/room-book", icon: <FaPlusCircle /> },
    { title: "Home", path: "/", icon: <FaHome /> },
  ];

  return (
    <div className="min-h-full bg-base-200 text-base-content w-80 p-4">
      {/* Sidebar Header / Brand - optionally redundant if Navbar has it, but good for mobile drawer context */}
      <div className="mb-8 px-4 py-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-primary">TCBR</span> Manager
        </h1>
        <p className="text-xs text-gray-500 mt-1">v1.0.0</p>
      </div>

      <ul className="menu text-base-content space-y-2">
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive
                  ? "bg-primary text-primary-content font-semibold shadow-md active"
                  : "hover:bg-base-300"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Optional User Info at Bottom */}
      <div className="absolute bottom-10 left-0 w-full px-4">
        <div className="divider"></div>
        <div className="flex items-center gap-3 px-4">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-8">
              <span className="text-xs">UI</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm">Admin User</p>
            <p className="text-xs opacity-70">admin@tcbr.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
