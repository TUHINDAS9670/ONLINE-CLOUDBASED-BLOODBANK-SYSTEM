import React, { useState ,useEffect} from "react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../redux/features/auth/authAction";
import Spinner from "../../components/shared/Spinner";
import { toast } from "react-toastify";


const Register = () => {
  const {loading,error}=useSelector((state)=>state.auth);
  const dispatch = useDispatch();
  const [role, setRole] = useState("Donor");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    hospitalName: "",
    organisationName: "",
    gender: "",
    bloodGroup: "",
    location: "",
    role: "Donor", // Initialize role in formData
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      hospitalName,
      organisationName,
      gender,
      bloodGroup,
      location,
      age,
      role,
    } = formData;
  
    console.log("Form submitted", formData);
    // alert("Thank you! for Register");
    try {
      dispatch(
        userRegister({
          firstName,
          lastName,
          role,
          email,
          password,
          location,
          age,
          gender,
          phoneNumber,
          hospitalName,
          organisationName,
          bloodGroup,
        })
      );
    } catch (error) {
      console.log(error);
      
    }
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      hospitalName: "",
      organisationName: "",
      gender: "",
      bloodGroup: "",
      location: "",
      role: "Donor", // Reset role in formData
    });
    setRole("Donor"); // Reset role state
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handle role changes
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({ ...formData, role: newRole }); // Update role in formData
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
      <Spinner/>
    ):(
      <div>
      
      <div className="flex flex-wrap gap-0">
        <div className="w-full md:w-2/3">
          <img
            // src={old}
            alt="loginImage"
            className="w-full h-full object-cover"
          />
        </div>

        <div className=" w-full md:w-1/3 h-full flex flex-col max-w-lg mx-auto p-6 bg-white shadow-lg rounded-md m-5 ">
          <div className="border-b-2 border-red-400 ">
            <h2 className="text-3xl font-bold text-center mb-1">
              Great Going!
            </h2>

            <h2 className="text-xl font-semibold text-center mb-2">
              Please Provide Further Details to Register as a {role}
            </h2>
          </div>
          {/* role checking */}

          <div className="flex items-center justify-center m-5 font-bold text-gray-600 text-lg">
            <div className="mt-1 flex ">
              <label className="ml-2">
                <input
                  type="radio"
                  name="role"
                  id="donorRadio"
                  value={"Donor"}
                  onChange={() => handleRoleChange("Donor")}
                  className="mr-2"
                  defaultChecked
                />
                Donor
              </label>
              <label className="ml-2">
                <input
                  type="radio"
                  name="role"
                  id="adminRadio"
                  value={"Admin"}
                  onChange={() => handleRoleChange("Admin")}
                  className="mr-2"
                />
                Admin
              </label>
              <label className="ml-2">
                <input
                  type="radio"
                  name="role"
                  id="hospitalRadio"
                  value={"Hospital"}
                  onChange={() => handleRoleChange("Hospital")}
                  className="mr-2"
                />
                Hospital
              </label>
              <label className="ml-2">
                <input
                  type="radio"
                  name="role"
                  id="organisationRadio"
                  value={"Organisation"}
                  onChange={() => handleRoleChange("Organisation")}
                  className="mr-2"
                />
                Organisation
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
            {(role === "Donor" || role === "Admin") && (
              <div>
                <div>
                  <label
                    htmlFor="firstname"
                    className="block font-semibold text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    placeholder="Enter your First Name"
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastname"
                    className="block font-semibold text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Enter your Last Name"
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  />
                </div>
              </div>
            )}
            {(role === "Hospital") && (
              <div>
                <div>
                  <label
                    htmlFor="hospitalname"
                    className="block font-semibold text-gray-700"
                  >
                    Hospital Name
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    placeholder="Enter Hospital Name"
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  />
                </div>
              </div>
            )}
            {(role === "Organisation") && (
              <div>
                <div>
                  <label
                    htmlFor="organisationname"
                    className="block font-semibold text-gray-700"
                  >
                    Organisation Name
                  </label>
                  <input
                    type="text"
                    name="organisationName"
                    value={formData.organisationName}
                    placeholder="Enter Organisation Name"
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block font-semibold text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
                className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleChange}
                className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                placeholder="Enter your contact number"
                onChange={handleChange}
                className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
              />
            </div>
            {(role !== "Admin" &&
              role !== "Hospital" &&
              role !== "Organisation" )&& (
                <div>
                  {/* blood group */}
                  <div>
                    <label
                      htmlFor="bloodgroup"
                      className="block font-semibold text-gray-700"
                    >
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      id="bloddGroup"
                      value={formData.bloodGroup}
                      required
                      onChange={handleChange}
                      className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                    >
                      <option value="" className="text-gray-400">
                        Select Your Blood Group
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="age"
                      className="block font-semibold text-gray-700"
                    >
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="18"
                      onChange={handleChange}
                      placeholder="Enter your age"
                      className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                    />
                  </div>
                </div>
              )}
               {/* Address */}
               <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter your address"
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg resize-none "
                  ></textarea>
                  
                </div>
            {(role === "Admin" || role === "Donor") && (
              <div>
               
                <label
                  htmlFor="gender"
                  className="block font-semibold text-gray-700"
                >
                  Gender
                </label>
                <div className="mt-1">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="ml-2">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      className="mr-2"
                    />
                    Female
                  </label>
                  <label className="ml-2">
                    <input
                      type="radio"
                      name="gender"
                      value="others"
                      className="mr-2"
                    />
                    others
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col justify-center items-center">
              <button
                type="submit"
                className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Register as {role}
              </button>
              <div className="flex mt-5">
                <p>Already have an account ?</p>
                <Link to="/login" className="text-red-500">
                  Sign In!
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

export default Register;
