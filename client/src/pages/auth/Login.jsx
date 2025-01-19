import React, { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userLogin } from "../../redux/features/auth/authAction";
import { useSelector } from "react-redux";
import Spinner from "../../components/shared/Spinner";
import { ToastContainer, toast } from 'react-toastify';
export const Login = () => {
  const { loading, error } = useSelector(state=> state.auth);
  const dispatch = useDispatch(); // Initialize dispatch
  const [role, setRole] = useState("Donor"); // Separate state for role
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Donor", // Default role
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData((prev) => ({ ...prev, role: newRole })); // Update role in formData
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password, role } = formData;

    // Validation
    if (!email || !password || !role) {
      return alert("Please provide all fields.");
    }

    // Dispatch the login action
    dispatch(userLogin({ email, password, role }));

    // Clear the form after submission
    setFormData({
      email: "",
      password: "",
      role: "Donor", // Reset role to default
    });
    setRole("Donor"); // Reset role state
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
    
    
     {loading ? <Spinner/>: (
      <div className="flex flex-wrap gap-0">
      <div className="w-full md:w-2/3">
        <img alt="loginImage" className="w-full h-full object-cover" />
      </div>
      <div className="w-full md:w-1/3 form-container h-screen flex justify-center items-center">
        <div className="w-[600px] p-6 bg-white shadow-lg rounded-md">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
          <div className="flex items-center justify-center m-5 font-bold text-gray-600 text-lg space-x-4">
            <label>
              <input
                type="radio"
                name="role"
                value="Donor"
                onChange={() => handleRoleChange("Donor")}
                className="mr-2"
                checked={role === "Donor"}
              />
              Donor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Admin"
                onChange={() => handleRoleChange("Admin")}
                className="mr-2"
                checked={role === "Admin"}
              />
              Admin
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Hospital"
                onChange={() => handleRoleChange("Hospital")}
                className="mr-2"
                checked={role === "Hospital"}
              />
              Hospital
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="Organisation"
                onChange={() => handleRoleChange("Organisation")}
                className="mr-2"
                checked={role === "Organisation"}
              />
              Organisation
            </label>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-lg"
          >
            <div>
              <label
                htmlFor="email"
                className="block font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="border mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="p-2 border mt-1 w-full shadow-lg shadow-red-100 rounded-lg"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Log In
              </button>
              <div className="flex mt-5">
                <p>Not Registered Yet?</p>
                <Link to="/register" className="text-red-500 ml-1">
                  Register Here!
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    )}
      
    </>
  );
};
