import React, { useState, useEffect } from "react";

import { Link, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userRegister } from "../../redux/features/auth/authAction";
import Spinner from "../../components/shared/Spinner";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";

const Register = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [role, setRole] = useState("Donor");
 
const navigate=useNavigate();
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
    age: "",
    country: "IN", // default to India
    state: "",
    city: "",
    location: "", // optional precise location if needed
    role: "Donor", // Initialize role in formData
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form submitted", formData);

    // Construct full address string
    const fullAddress = {
      country: Country.getCountryByCode(formData.country)?.name || formData.country,
      state: State.getStateByCodeAndCountry(formData.state, formData.country)?.name || formData.state,
      district: formData.city,
      city: formData.city,
      location: formData.location,
      full: `${Country.getCountryByCode(formData.country)?.name || formData.country}, ${State.getStateByCodeAndCountry(formData.state, formData.country)?.name || formData.state}, ${formData.city}, ${formData.location}`,
    };
    
    const {
      country, state, city, location, // exclude address fields from root
      ...restFormData
    } = formData;
    const submissionData = {
      ...restFormData,
      
      location: fullAddress,
    };


 console.log("Final Submission Data:", submissionData);
    try {
      dispatch(userRegister(submissionData));
    } catch (error) {
      console.log(error);
    }

    // Reset the form
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
      age: "",
      country: "IN",
      state: "",
      city: "",
      location: "",
      role: "Donor",
    });

    setRole("Donor");
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData((prevData) => ({
        ...prevData,
        state: value,
        city: "", // reset city when state changes
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // Handle role changes
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData({ ...formData, role: newRole }); // Update role in formData
  };
  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);
  useEffect(() => {
    if (formData.country) {
      const allStates = State.getStatesOfCountry(formData.country);
      setStates(allStates);
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      const allCities = City.getCitiesOfState(formData.country, formData.state);
      setCities(allCities);
    }
  }, [formData.state]);
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
        <div className="min-h-screen bg-gradient-to-tr from-black via-red-700 to-black flex items-center justify-center relative overflow-hidden">
          <div className="absolute w-96 h-96 bg-red-400 opacity-20 rounded-full blur-3xl animate-pulse -top-10 -left-20"></div>
          <div className="absolute w-96 h-96 bg-red-500 opacity-30 rounded-full blur-3xl animate-ping top-32 right-0"></div>

          <div className="bg-white/19 backdrop-blur-md border border-red-300 shadow-2xl rounded-xl max-w-3xl w-full  flex flex-col p-8 z-10 text-white">
            <h2 className="text-3xl font-bold text-center mb-2">Great Going!</h2>
            <h3 className="text-xl font-semibold text-center mb-4">Please Provide Further Details to Register as a {role}</h3>
              {/* role checking */}

              <div className="flex items-center justify-center m-5 font-bold text-white-600 text-lg">
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
                {(role === "Donor" ) && (
                  <div>
                    <div>
                      <label
                        htmlFor="firstname"
                        className="block font-semibold text-white"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="Enter your First Name"
                        onChange={handleChange}
                        className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastname"
                        className="block font-semibold text-white"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Enter your Last Name"
                        onChange={handleChange}
                        className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                      />
                    </div>
                  </div>
                )}
                {role === "Hospital" && (
                  <div>
                    <div>
                      <label
                        htmlFor="hospitalname"
                        className="block font-semibold text-white"
                      >
                        Hospital Name
                      </label>
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        placeholder="Enter Hospital Name"
                        onChange={handleChange}
                        className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                      />
                    </div>
                  </div>
                )}
                {role === "Organisation" && (
                  <div>
                    <div>
                      <label
                        htmlFor="organisationname"
                        className="block font-semibold text-white"
                      >
                        Organisation Name
                      </label>
                      <input
                        type="text"
                        name="organisationName"
                        value={formData.organisationName}
                        placeholder="Enter Organisation Name"
                        onChange={handleChange}
                        className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block font-semibold text-white">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-white">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    placeholder="Enter your contact number"
                    onChange={handleChange}
                    className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
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
                          className="block font-semibold text-white"
                        >
                          Blood Group
                        </label>
                        <select
                          name="bloodGroup"
                          id="bloddGroup"
                          value={formData.bloodGroup}
                          required
                          onChange={handleChange}
                          className="border rounded-lg border-red-600  mt-1 w-full text-black p-2 shadow-lg"
                        >
                          <option value="" className="text-black">
                            Select Your Blood Group
                          </option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="A+">A+</option>
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
                          className="block font-semibold text-white"
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
                          className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                        />
                      </div>
                    </div>
                  )}
    
                <div>
                  <label className="block font-semibold text-white">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border  border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  >
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="border  rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white">
                    District / City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-white">
                    Location
                  </label>
                  <textarea
                    required
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter specific address e.g., House no., street name ,landmark"
                    className="border rounded-lg border-red-600 mt-1 w-full text-black p-2 shadow-lg"
                  />
                </div>


                {(role === "Admin" || role === "Donor") && (
                  <div>
                    <label
                      htmlFor="gender"
                      className="block font-semibold text-white"
                    >
                      Gender
                    </label>
                    <div className="mt-1">
                      <label>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          className="mr-2 rounded-lg"
                          onChange={handleChange}
                          checked={formData.gender === "male"}
                        />
                        Male
                      </label>
                      <label className="ml-2">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          className="mr-2 rounded-lg"
                          onChange={handleChange}
                          checked={formData.gender === "female"}
                        />
                        Female
                      </label>
                      <label className="ml-2">
                        <input
                          type="radio"
                          name="gender"
                          value="others"
                          className="mr-2 rounded-lg"
                          onChange={handleChange}
                          checked={formData.gender === "others"}
                        />
                        others
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex flex-col justify-center items-center">
                  <button
                    type="submit"
                className="w-full  bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    Register as {role}
                  </button>
                  <button
                className="w-full  bg-white/20 hover:bg-white/30 text-white mt-3 py-2 rounded-lg font-semibold transition"
                    onClick={()=>{navigate("/")}}
                  >
                    Back to Home
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
        
      )}
    </>
  );
};

export default Register;
