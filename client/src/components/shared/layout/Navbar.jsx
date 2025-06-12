import React, { useState } from "react";
import "../../../App.css";
import { NavLink } from "react-router";
import { useNavigate,useLocation,Link } from "react-router-dom";
// react icons
import { FaBars, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { MdBloodtype } from "react-icons/md";

import { MdMenuOpen } from "react-icons/md";
import { useSelector } from "react-redux";
// import Modal from'./Modal'

const Navbar = () => {
  const  {user}  = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location=useLocation();
  //usestate for loginmodal
  // const[isModalOpen,setIsModalOpen]=useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // const navItems = [
  //   { path: "/", link: "Home" },
  //   { path: "/blogs", link: "Blogs" },
  //   { path: "/contactus", link: "ContactUs" },
  //   { path: "/about", link: "About" },
  //   { path: "/services", link: "Services" },

  // ];
  //logout handler
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.clear();
    alert("Logout successfully !");
    navigate("/login");
  };

  return (
   <header className="bg-black text-white fixed top-0 left-0 right-0 z-50">
  <nav className="px-2 py-4 max-w-7xl mx-auto flex justify-between items-center">
    <a href="/" className="text-4xl font-bold text-red-500 flex items-center gap-2 hover:opacity-80 transition-all">
      <MdBloodtype />
      BLOOD BANK <span className="text-white ml-3">APP</span>
    </a>

    {/* Desktop Nav */}
    <ul className="md:flex gap-8 text-lg hidden">
      <li>
        <p className="text-white">
          Welcome{" "}
          <span className="font-semibold text-3xl">
            {user?.name || user?.hospitalName || user?.organisationName}
          </span>
          &nbsp;
          <span className="bg-slate-400 p-2 rounded-lg text-black">
            {user?.role}
          </span>
        </p>
      </li>

      {location.pathname === "/" ? (
        <li>
          <Link to="/analytics" className="nav-link">
            Analytics
          </Link>
        </li>
      ) : (
        <li>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
      )}

      <li className="nav-item">
        <NavLink to="/dashboard/my-profile" className="nav-link">
          <i className="bi bi-person-lines-fill me-2"></i>My Profile
        </NavLink>
      </li>

      <li>
        <button
          className="text-white hover:text-red-400 bg-red-600 font-bold rounded-lg px-6 py-2 hover:bg-white transition-all duration-150 ease-in"
          onClick={handleLogOut}
        >
          Log Out
        </button>
      </li>
    </ul>

    {/* Mobile Menu Button */}
    <div className="md:hidden">
      <button onClick={toggleMenu} className="text-white">
        {isMenuOpen ? (
          <MdMenuOpen className="w-7 h-8" />
        ) : (
          <FaBars className="w-7 h-8" />
        )}
      </button>
    </div>
  </nav>

  {/* Mobile Dropdown Menu */}
  <div>
    <ul
      className={`md:hidden text-black text-lg space-y-4 px-4 py-6 bg-white w-full shadow-md transition-all duration-300 ${
        isMenuOpen ? "block" : "hidden"
      }`}
    >
      <li>
        <Link to="/" className="hover:text-red-500" onClick={toggleMenu}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/analytics" className="hover:text-red-500" onClick={toggleMenu}>
          Analytics
        </Link>
      </li>
      <li>
        <NavLink to="/dashboard/my-profile" className="hover:text-red-500" onClick={toggleMenu}>
          My Profile
        </NavLink>
      </li>
      <li>
        <button
          onClick={() => {
            toggleMenu();
            handleLogOut();
          }}
          className="text-white bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </li>
    </ul>
  </div>
</header>

  );
};

export default Navbar;
