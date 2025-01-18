import React, { useState } from "react";
import old from "../../assets/images/old.jpg";
const Register = () => {
  const [role, setRole] = useState("donor");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password:"",
    phoneNumber: "",
    hospitalName:"",
    organisationName:"",
    gender: "",
    bloodGroup: "",
    location: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", formData);
    alert("Thank you! for Register");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password:"",
      phoneNumber: "",
      hospitalName:"",
      organisationName:"",
      gender: "",
      bloodGroup: "",
      location: "",
    });
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  return (
    <div>
      <div className="flex flex-wrap gap-0">
        <div className="w-full md:w-2/3">
          <img
            src={old}
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
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
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
                    name="organisationlName"
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
                name="phonenmuber"
                value={formData.phoneNumber}
                placeholder="Enter your contact number"
                onChange={handleChange}
                className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
              />
            </div>
            {role !== "Admin" &&
              role !== "Hospital" &&
              role !== "Organisation" && (
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

            {(role === "Admin" || role === "Donor") && (
              <div>
                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Enter your address"
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg resize-none "
                  ></textarea>
                </div>
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

            <div>
              <button
                type="submit"
                className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Register as {role}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
