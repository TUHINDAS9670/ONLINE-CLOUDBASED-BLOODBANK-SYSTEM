import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../../redux/features/auth/authAction";
import Spinner from "../../components/shared/Spinner";

const CreateAdminPage = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigatee = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    country: "IN",
    state: "",
    city: "",
    location: "",
    role: "Admin", // fixed role
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "state") {
      setFormData({ ...formData, state: value, city: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullAddress = {
      country:
        Country.getCountryByCode(formData.country)?.name || formData.country,
      state:
        State.getStateByCodeAndCountry(formData.state, formData.country)
          ?.name || formData.state,
      district: formData.city,
      city: formData.city,
      location: formData.location,
      full: `${
        Country.getCountryByCode(formData.country)?.name || formData.country
      }, ${
        State.getStateByCodeAndCountry(formData.state, formData.country)
          ?.name || formData.state
      }, ${formData.city}, ${formData.location}`,
    };

    const { country, state, city, location, ...restFormData } = formData;
    const submissionData = { ...restFormData, location: fullAddress };

    dispatch(userRegister(submissionData));

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      gender: "",
      country: "IN",
      state: "",
      city: "",
      location: "",
      role: "Admin",
    });
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    }
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      setCities(City.getCitiesOfState(formData.country, formData.state));
    }
  }, [formData.state]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4 text-center">Register as Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-semibold">First Name</label>
          <input
            type="text"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="font-semibold">Last Name</label>
          <input
            type="text"
            name="lastName"
            required
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="font-semibold">Password</label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="font-semibold">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <div>
          <label className="font-semibold">Gender</label>
          <div className="mt-1">
            {["male", "female", "others"].map((g) => (
              <label key={g} className="mr-4">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="mr-1"
                />
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="font-semibold">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          >
            {countries.map((country) => (
              <option key={country.isoCode} value={country.isoCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold">State</label>
          <select
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
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
          <label className="font-semibold">City / District</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
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
          <label className="font-semibold">Exact Location</label>
          <textarea
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="House No, Landmark, Area etc."
            className="w-full border border-red-600 mt-1 p-2 rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Register as Admin
        </button>
        <button
          type="button"
          onClick={() => navigatee("/")}
          className="w-full mt-2 bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400"
        >
          Back to Home
        </button>
      </form>
    </div>
  );
};

export default CreateAdminPage;
