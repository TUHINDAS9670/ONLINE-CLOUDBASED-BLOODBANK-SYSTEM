import React from "react";
import { userMenu } from "./Menu/userMenu";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <div>
      <div className="sidebar left-0 top-0 h-screen border-2 bg-slate-400 shadow-md ">
        <div className="menu">
          {userMenu.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <div
                className={`p-4 border my-1 ${
                  isActive ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                }`}
              >
                <i className="menu.icon"></i>
                <Link to={menu.path}>{menu.name}</Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
