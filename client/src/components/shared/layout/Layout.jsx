import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

const Layout = ({ children }) => {
  return (
    <div>
      <div className="header">
        <Navbar />
      </div>
      <div className="flex">
    <div className="mt-[90px] w-full md:w-1/4 bg-gray-100 p-4 -ml-4"><Sidebar/></div>
    <div className="w-full md:w-3/4 p-4">{children}</div>
  </div>
  </div>
  );
};

export default Layout;
