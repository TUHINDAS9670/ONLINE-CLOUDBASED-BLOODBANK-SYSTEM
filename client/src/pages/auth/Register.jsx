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
  
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const formData= {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //     phoneNumber,
  //     hospitalName,
  //     organisationName,
  //     gender,
  //     bloodGroup,
  //     location,
  //     age,
  //     role,
  //   } ;

  //   console.log("Form submitted", formData);
  //   // alert("Thank you! for Register");
  //   try {
  //     dispatch(
  //       userRegister({
  //         // name: `${firstName} ${lastName}`.trim(), // ✅ Combine first & last name
  //         firstName,
  //         lastName,
  //         role,
  //         email,
  //         password,
  //         location,
  //         age,
  //         gender,
  //         phoneNumber,
  //         hospitalName,
  //         organisationName,
  //         bloodGroup,
  //       })
  //     );
  //   } catch (error) {
  //     console.log(error);

  //   }
  //   setFormData({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: "",
  //     phoneNumber: "",
  //     hospitalName: "",
  //     organisationName: "",
  //     gender: "",
  //     bloodGroup: "",
  //     location: "",
  //     role: "Donor", // Reset role in formData
  //   });
  //   setRole("Donor"); // Reset role state
  // };

  //old form date before update adrees field
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form submitted", formData);
  //   try {
  //     dispatch(userRegister(formData)); // use the state directly
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   // Reset the form
  //   setFormData({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     password: "",
  //     phoneNumber: "",
  //     hospitalName: "",
  //     organisationName: "",
  //     gender: "",
  //     bloodGroup: "",
  //     location: "",
  //     role: "Donor",
  //   });
  //   setRole("Donor");
  // };
  //new form dagta fter update address field
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

    // // Clean up unused fields if necessary
    // delete submissionData.city;
    // delete submissionData.state;
    // delete submissionData.country;
    // delete submissionData.location;
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
                {role === "Hospital" && (
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
                {role === "Organisation" && (
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
                {/* Address */}
                {/* <div>
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
                  
                </div> */}
                <div>
                  <label className="block font-semibold text-gray-700">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  >
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
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
                  <label className="block font-semibold text-gray-700">
                    District / City
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
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
                  <label className="block font-semibold text-gray-700">
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
                    className="border border-red-600 mt-1 w-full p-2 shadow-lg shadow-red-100 rounded-lg"
                  />
                </div>
                {/* <button
  type="button"
  onClick={async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
  
          if (data && data.address) {
            const { state, county, village, city, town, suburb, municipality } = data.address;
            const district = county || municipality || city || town || village || suburb || "";
            const location = data.display_name;
  
            setFormData((prev) => ({
              ...prev,
              location: location || "",
              state: state || "",
              city: district || "",
              latitude: latitude.toString(),     // ✅ Store lat
              longitude: longitude.toString(),   // ✅ Store lng
            }));
  
            toast.success("Address auto-filled from current location!");
          } else {
            toast.error("Failed to extract address details.");
          }
        } catch (error) {
          console.error(error);
          toast.error("Error fetching address from location.");
        }
      },
      () => {
        toast.error("Failed to detect location.");
      }
    );
  }}  
>
  Auto-detect Location
</button> */}

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
                          className="mr-2"
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
                          className="mr-2"
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
                    className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Register as {role}
                  </button>
                  <button
                    className="mt-2 w-full bg-red-500 text-white py-2 px-4 rounded-md shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
        </div>
      )}
    </>
  );
};

export default Register;
