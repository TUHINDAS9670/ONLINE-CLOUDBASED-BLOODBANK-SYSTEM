import React from "react";
// import { userMenu } from "./Menu/userMenu";
import { Link, useLocation } from "react-router-dom";
import { FaWarehouse } from "react-icons/fa";
import { BiDonateBlood } from "react-icons/bi";
import { FaHospitalAlt } from "react-icons/fa";
import { FaBuildingNgo } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { FaHospital } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { FaHistory } from "react-icons/fa";

import { useSelector } from "react-redux";
const Sidebar = () => {
  // GET USER STATE
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  return (
    <div className="block">
      <div className="sidebar left-0 top-0 h-screen border-2 bg-slate-400 shadow-md ">
        <div className="menu ">
          {user?.role === "Organisation" && (
            <>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaWarehouse className="lg:w-[80px] lg:h-[30px]  " />
                <Link to="/" className="font-bold ml-[-22px]">
                  Inventory
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/organisation/emergency-requests"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]" />
                <Link
                  to="/organisation/emergency-requests"
                  className="font-bold ml-[-22px]"
                >
                  Patient's Emergency Request
                </Link>
              </div>
              {/* <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/organisation/request-history"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]" />
                <Link
                  to="/organisation/request-history"
                  className="font-bold ml-[-22px]"
                >
                  Patient's Emergency Request History
                </Link>
              </div> */}
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/organisation/donation-requests"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]  " />

                <Link
                  to="/organisation/donation-requests"
                  className="font-bold ml-[-22px]"
                >
                  Donation Requests
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname ===
                  "/organisation/organaisation-hospital-blood-requests"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]  " />

                <Link
                  to="/organisation/organaisation-hospital-blood-requests"
                  className="font-bold ml-[-22px]"
                >
                  Hospital's Emergency Requests
                </Link>
              </div>

              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg  pl-11 ${
                  location.pathname === "/donor"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <BiDonateBlood className="lg:w-[80px] lg:h-[30px]  " />

                <Link to="/donor" className="font-bold ml-[-22px]">
                  Donor
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/hospital"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]  " />

                <Link to="/hospital" className="font-bold ml-[-22px]">
                  Hospital
                </Link>
              </div>
            </>
          )}
          {user?.role === "Admin" && (
            <>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/admin/emergency-requests"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospitalAlt className="lg:w-[80px] lg:h-[30px]" />
                <Link
                  to="/admin/emergency-requests"
                  className="font-bold ml-[-22px]"
                >
                  Emergency Request Manage
                </Link>
              </div>

              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/register-admin"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <IoIosPeople className="lg:w-[80px] lg:h-[30px]  " />
                <Link to="/register-admin" className="font-bold ml-[-22px]">
                  Add New Admin
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/donor-list"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <IoIosPeople className="lg:w-[80px] lg:h-[30px]  " />
                <Link to="/donor-list" className="font-bold ml-[-22px]">
                  Donor List
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg  pl-11 ${
                  location.pathname === "/hospital-list"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHospital className="lg:w-[80px] lg:h-[30px]  " />

                <Link to="/hospital-list" className="font-bold ml-[-22px]">
                  Hospital List
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/org-list"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaBuildingNgo className="lg:w-[80px] lg:h-[30px]  " />

                <Link to="/org-list" className="font-bold ml-[-22px]">
                  Organization List
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/admin-list"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaBuildingNgo className="lg:w-[80px] lg:h-[30px]"/>

                <Link to="/admin-list" className="font-bold ml-[-22px]">
                  Admin List
                </Link>
              </div>
            </>
          )}
          {(user?.role === "Donor" || user?.role === "Hospital") && (
            <div
              className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                location.pathname === "/organisation" ||
                location.pathname === "/"
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
            >
              <FaBuildingNgo className="lg:w-[80px] lg:h-[30px]  " />

              <Link to="/organisation" className="font-bold ml-[-22px]">
                Organisation
              </Link>
            </div>
          )}

          {user?.role === "Hospital" && (
            <div
              className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                location.pathname === "/hospital-blood-request" ||
                location.pathname === "/"
                  ? "bg-red-500 text-white "
                  : "bg-gray-200 text-black"
              }`}
            >
              <BiDonateBlood className="lg:w-[80px] lg:h-[30px]" />
              <Link
                to="/hospital-blood-request"
                className="font-bold ml-[-22px]"
              >
                Request Blood
              </Link>
            </div>
          )}

          {user?.role === "Donor" && (
            <>
              {" "}
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/donation-list"
                    ? "bg-red-500 text-white "
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHistory className="lg:w-[80px] lg:h-[30px]  " />

                <Link to="/donation-list" className="font-bold ml-[-22px]">
                  Donation History
                </Link>
              </div>
              {/* <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/donation-list"
                    ? "bg-red-500 text-white "
                    : "bg-gray-200 text-black"
                }`}
              >
                <FaHistory className="lg:w-[80px] lg:h-[30px]  " />

                <li>
                  <Link to="/donor/emergency-requests" className="font-bold ml-[-22px]">
                    Emergency Requests
                  </Link>
                </li>
              </div> */}
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/donation-request"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <BiDonateBlood className="lg:w-[80px] lg:h-[30px]" />
                <Link to="/donation-request" className="font-bold ml-[-22px]">
                  Donation Request
                </Link>
              </div>
              <div
                className={`p-4 border my-1 lg:flex gap-3 text-lg pl-11 ${
                  location.pathname === "/donor-dashboard"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                <MdDashboard className="lg:w-[80px] lg:h-[30px]" />
                <Link to="/donor-dashboard" className="font-bold ml-[-22px]">
                  Dashboard
                </Link>
              </div>
            </>
          )}

          {/* {userMenu.map((menu) => {
           

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
          })} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
