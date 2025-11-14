
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router";
import useAxios from "../../hooks/useAxios";
import { AuthContext } from "../../../Provider/AuthContext";

const Sidebar = ({ collapsed }) => {
  const { loading, setLoading } = useContext(AuthContext);
  const [menus, setMenus] = useState([]);
  const AxiosInstance = useAxios();

  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch menus only once
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const res = await AxiosInstance.get("menus");
        setMenus(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []); // IMPORTANT: empty dependency

  const handleToggle = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  if (loading) return <h1 className="text-2xl">Loading..</h1>;

  return (
    <div
      className={`drawer drawer-open overflow-visible transition-all ease-in-out ${
        collapsed ? "hidden" : "md:fixed inset-0 z-40"
      } md:relative md:inset-auto md:z-auto `}
    >
      <input id="my-drawer-1" type="checkbox" className="drawer-toggle" />

      <div className="drawer-side">
        <label htmlFor="my-drawer-1" className="drawer-overlay"></label>

        <ul className="menu bg-base-200 min-h-full w-60 p-4 py-10 space-y-10">
          <div className="flex flex-col justify-center items-center py-5">
            <h1>users</h1>
            <p>user role</p>
          </div>

          <nav className="flex flex-col space-y-5 w-full px-2">
            {menus.map((m) => {
              const isOpen = openMenuId === m._id;

              return (
                <div key={m._id} className="w-full text-xl">
                  {m.isSubMenu ? (
                    <div className="w-full">
                      <div className="flex items-center px-5 py-2 gap-2 hover:bg-amber-400 rounded-lg">
                        <img className="w-1/10" src={m.icon} alt="" />

                        <button
                          className="flex justify-center items-center"
                          onClick={() => handleToggle(m._id)}
                        >
                          <span className="mr-2">{m.title}</span>
                          <span className="ml-auto">{isOpen ? "▲" : "▼"}</span>
                        </button>
                      </div>

                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="pl-4 pt-2 space-y-5 flex flex-col">
                          {m.subMenu.map((sub) => (
                            <NavLink
                              className="hover:bg-amber-400 rounded-lg p-2"
                              key={sub.id}
                              to={sub.path}
                            >
                              {sub.title}
                            </NavLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <NavLink
                      className="flex gap-5 items-center hover:bg-amber-400 rounded-lg px-5 py-2"
                      to={m.path}
                    >
                      <img className="w-1/10" src={m.icon} alt="" />
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

export default React.memo(Sidebar);
