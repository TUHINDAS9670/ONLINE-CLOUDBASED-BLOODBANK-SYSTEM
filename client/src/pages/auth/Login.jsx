import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../redux/features/auth/authAction";
import Spinner from "../../components/shared/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa"; 
import { BiDonateBlood } from "react-icons/bi";
import { FaHospital } from "react-icons/fa";
import { FaBuildingNgo } from "react-icons/fa6";

export const Login = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [role, setRole] = useState("Donor");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Donor",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData((prev) => ({ ...prev, role: newRole }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, role } = formData;
    if (!email || !password || !role) {
      return alert("Please provide all fields.");
    }
    dispatch(userLogin({ email, password, role }));
    setFormData({ email: "", password: "", role: "Donor" });
    setRole("Donor");
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }, [error]);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-animate bg-gradient-to-tr from-black via-red-900 to-black overflow-hidden relative">
          {/* Soft glow animation blobs */}
          <div className="absolute w-96 h-96 bg-red-400 opacity-20 rounded-full blur-3xl animate-pulse -top-10 -left-20"></div>
          <div className="absolute w-96 h-96 bg-red-500 opacity-30 rounded-full blur-3xl animate-ping top-32 right-0"></div>

          <div className="z-10 bg-white/10 backdrop-blur-md p-10 rounded-xl shadow-2xl border border-red-300 max-w-md w-full">
            <div className="flex flex-col items-center mb-6">
              {role === "Donor" ? (
                <BiDonateBlood className="text-6xl text-red-500 drop-shadow" />
              ) : role === "Hospital" ? (
                <FaHospital className="text-6xl text-red-500 drop-shadow" />
              ) : role === "Organisation" ? (
                <FaBuildingNgo className="text-6xl text-red-500 drop-shadow" />
              ) : (
                <FaUserCircle className="text-6xl text-red-500 drop-shadow" />
              )}

              <h2 className="text-3xl text-white font-bold mt-2 tracking-wide">Login</h2>
            </div>

            <div className="flex items-center justify-center mb-5 text-white text-sm font-semibold space-x-4">
              {["Donor", "Admin", "Hospital", "Organisation"].map((r) => (
                <label key={r} className="cursor-pointer hover:text-red-400">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    onChange={() => handleRoleChange(r)}
                    className="mr-1 accent-red-500"
                    checked={role === r}
                  />
                  {r}
                </label>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="text-white text-sm space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full p-2 bg-white/20 text-white placeholder-gray-200 border border-red-300 rounded focus:outline-none"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  className="w-full p-2 bg-white/20 text-white placeholder-gray-200 border border-red-300 rounded focus:outline-none"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 transition duration-300 text-white py-2 rounded shadow-md"
              >
                Log In
              </button>

              <button
                type="button"
                className="w-full mt-2 bg-white/20 hover:bg-white/30 transition duration-300 text-white py-2 rounded shadow-md"
                onClick={() => navigate("/")}
              >
                Back to Home
              </button>

              <div className="mt-4 text-center">
                <p>
                  Not Registered Yet?{" "}
                  <Link to="/register" className="text-red-300 hover:underline">
                    Register Here!
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </>
  );
};

// old form style

// this is my login.jsx can you update this with some futeristic and animated login pafes with some icon or may be you cann add any animation but please dont update or edit any logic code
// import React, { useState,useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { Link,useNavigate } from "react-router-dom";
// import { userLogin } from "../../redux/features/auth/authAction";
// import { useSelector } from "react-redux";
// import Spinner from "../../components/shared/Spinner";
// import { ToastContainer, toast } from 'react-toastify';
// export const Login = () => {
// const { loading, error } = useSelector(state=> state.auth);
// const dispatch = useDispatch(); // Initialize dispatch
// const \[role, setRole] = useState("Donor"); // Separate state for role
// const \[formData, setFormData] = useState({
// email: "",
// password: "",
// role: "Donor", // Default role
// });
// const navigate=useNavigate();
// const handleChange = (e) => {
// const { name, value } = e.target;
// setFormData((prev) => ({ ...prev, \[name]: value }));
// };

// const handleRoleChange = (newRole) => {
// setRole(newRole);
// setFormData((prev) => ({ ...prev, role: newRole })); // Update role in formData
// };

// const handleSubmit = (e) => {
// e.preventDefault();
// const { email, password, role } = formData;

// ```
// // Validation
// if (!email || !password || !role) {
//   return alert("Please provide all fields.");
// }

// // Dispatch the login action
// dispatch(userLogin({ email, password, role }));

// // Clear the form after submission
// setFormData({
//   email: "",
//   password: "",
//   role: "Donor", // Reset role to default
// });
// setRole("Donor"); // Reset role state
// ```

// };
// useEffect(() => {
// if (error) {
// toast.error(error, {
// position: "top-right",
// autoClose: 5000,
// hideProgressBar: false,
// closeOnClick: true,
// pauseOnHover: true,
// draggable: true,
// theme: "dark",
// });
// }
// }, \[error]);
// return (
// <>

// ```
//  {loading ? <Spinner/>: (
//   <div className="flex flex-wrap gap-0">
//   <div className="w-full md:w-2/3">
//     {/* <img alt="loginImage" className="w-full h-full object-cover" /> */}
//   </div>
//   <div className="w-full md:w-1/3 form-container h-screen flex justify-center items-center">
//     <div className="w-[600px] p-6 bg-white shadow-lg rounded-md">
//       <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
//       <div className="flex items-center justify-center m-5 font-bold text-gray-600 text-lg space-x-4">
//         <label>
//           <input
//             type="radio"
//             name="role"
//             value="Donor"
//             onChange={() => handleRoleChange("Donor")}
//             className="mr-2"
//             checked={role === "Donor"}
//           />
//           Donor
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="role"
//             value="Admin"
//             onChange={() => handleRoleChange("Admin")}
//             className="mr-2"
//             checked={role === "Admin"}
//           />
//           Admin
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="role"
//             value="Hospital"
//             onChange={() => handleRoleChange("Hospital")}
//             className="mr-2"
//             checked={role === "Hospital"}
//           />
//           Hospital
//         </label>
//         <label>
//           <input
//             type="radio"
//             name="role"
//             value="Organisation"
//             onChange={() => handleRoleChange("Organisation")}
//             className="mr-2"
//             checked={role === "Organisation"}
//           />
//           Organisation
//         </label>
//       </div>
//       <form
//         onSubmit={handleSubmit}
//         className="flex flex-col gap-4 text-lg"
//       >
//         <div>
//           <label
//             htmlFor="email"
//             className="block font-medium text-gray-700"
//           >
//             Email Address
//           </label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             placeholder="Enter your email"
//             className="border mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div>
//           <label
//             htmlFor="password"
//             className="block font-medium text-gray-700"
//           >
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             placeholder="Enter password"
//             className="p-2 border mt-1 w-full shadow-lg shadow-red-100 rounded-lg"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//         </div>
//         <div className="flex flex-col items-center">
//           <button
//             type="submit"
//             className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 my-3"
//           >
//             Log In
//           </button>
//           <button
//             type="button"
//             className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//              onClick={()=>{navigate("/")}}
//           >
//             Back to Home
//           </button>
//           <div className="flex mt-5">
//             <p>Not Registered Yet?</p>
//             <Link to="/register" className="text-red-500 ml-1">
//               Register Here!
//             </Link>
//           </div>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>
// )}
  
// </>
// ```

// );
// };

