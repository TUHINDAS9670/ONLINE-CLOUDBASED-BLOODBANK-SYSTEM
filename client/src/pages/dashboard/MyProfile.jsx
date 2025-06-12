import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserProfile,
  getCurrentUser,
  changePassword, // ✅ <-- Add this
} from "../../redux/features/auth/authAction";

import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../../components/shared/modal/ChangePasswordModal";
import { toast } from "react-toastify";

const MyProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState(null);

//  useEffect(() => {
//   if (!user) {
//     dispatch(getCurrentUser({}));
//   } else {
//     const countryObj = Country.getAllCountries().find(
//       (c) => c.name.toLowerCase() === user.location?.country?.toLowerCase()
//     );

//     const allStates = State.getStatesOfCountry(countryObj?.isoCode);
//     const stateObj = allStates.find(
//       (s) => s.name.toLowerCase() === user.location?.state?.toLowerCase()
//     );

//     const allCities = City.getCitiesOfState(countryObj?.isoCode, stateObj?.isoCode);
//     const matchedCity = allCities.find(
//       (c) => c.name.toLowerCase() === user.location?.city?.toLowerCase()
//     );

//     setFormData({
//       userId: user._id || "",
//       firstName: user.firstName || "",
//       lastName: user.lastName || "",
//       name: user.name || "",
//       email: user.email || "",
//       phoneNumber: user.phoneNumber || "",
//       organisationName: user.organisationName || "",
//       hospitalName: user.hospitalName || "",
//       bloodGroup: user.bloodGroup || "",
//       streetAddress: user.location?.location || "",
//       location: {
//         country: countryObj?.isoCode || "IN",
//         state: stateObj?.isoCode || "", // <-- using ISO
//         city: matchedCity?.name || "", // <-- ensure city exists in options
//       },
//     });
//   }
// }, [user]);
useEffect(() => {
  if (!user) {
    dispatch(getCurrentUser({}));
  } else if (user.location && typeof user.location === "object") {
    const allCountries = Country.getAllCountries();
    const countryObj = allCountries.find(
      (c) =>
        c.isoCode?.toLowerCase() === user.location?.country?.toLowerCase() ||
        c.name?.toLowerCase() === user.location?.country?.toLowerCase()
    );

    let stateIso = "";
    let cityName = "";

    if (countryObj) {
      const allStates = State.getStatesOfCountry(countryObj.isoCode);
      const stateObj = allStates.find(
        (s) =>
          s.isoCode?.toLowerCase() === user.location?.state?.toLowerCase() ||
          s.name?.toLowerCase() === user.location?.state?.toLowerCase()
      );
      stateIso = stateObj?.isoCode || "";

      const allCities = City.getCitiesOfState(countryObj.isoCode, stateIso);
      const matchedCity = allCities.find(
        (c) =>
          c.name?.toLowerCase() === user.location?.city?.toLowerCase()
      );
      cityName = matchedCity?.name || "";
    }

    setFormData({
      userId: user._id || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      name: user.name || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      organisationName: user.organisationName || "",
      hospitalName: user.hospitalName || "",
      bloodGroup: user.bloodGroup || "",
      streetAddress: user.location?.location || "",
      location: {
        country: countryObj?.isoCode || "IN",
        state: stateIso,
        city: cityName,
      },
    });
  }
}, [user]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["country", "state", "city"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordChange = async (oldPass, newPass) => {
  try {
    dispatch(
      changePassword({ oldPassword: oldPass, newPassword: newPass })
    );
    // ✅ Remove this line
    // toast.success("Password updated successfully");
  } catch (err) {
    // ✅ Also remove this error toast
    // toast.error("Failed to update password");
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    const countryObj = Country.getCountryByCode(formData.location.country);
    const countryName = countryObj?.name || "";
    const stateName = formData.location.state;
    const cityName = formData.location.city;
    const street = formData.streetAddress || "";

    const fullAddress = `${street}, ${cityName}, ${stateName}, ${countryName}`;

    const finalPayload = {
      ...formData,
      location: {
        country: formData.location.country,
        state: stateName,
        district: cityName,
        city: cityName,
        location: street,
        full: fullAddress,
      },
    };

    dispatch(updateUserProfile(finalPayload)).then(() => {
      dispatch(getCurrentUser({}));
    });
  };

  if (!formData)
    return (
      <div className="text-center mt-10 text-lg font-medium">
        Loading Profile...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-red-600 text-center mb-6 border-b pb-2">
        My Profile
      </h2>
      {/* Change Password Section */}

        <div className="flex justify-end mb-4">
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Change Password
          </button>
        </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {user.role == "Donor" && (
          <>
            <div>
              <label className="block text-red-600 mb-1"> Name</label>
              <input
                type="text"
                name="firstName"
                className="w-full border border-red-400 rounded px-3 py-2"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-red-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border border-red-400 rounded px-3 py-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-red-600 mb-1">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            className="w-full border border-red-400 rounded px-3 py-2"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {user?.role === "Donor" && (
          <div>
            <label className="block text-red-600 mb-1">Blood Group</label>
            <input
              type="text"
              name="bloodGroup"
              className="w-full border border-red-400 rounded px-3 py-2"
              value={formData.bloodGroup}
              onChange={handleChange}
            />
          </div>
        )}
        {user?.role === "Hospital" && (
          <div>
            <label className="block text-red-600 mb-1">Hospital Name</label>
            <input
              type="text"
              name="hospitalName"
              className="w-full border border-red-400 rounded px-3 py-2"
              value={formData.hospitalName}
              onChange={handleChange}
            />
          </div>
        )}
        {user?.role === "Organisation" && (
          <div>
            <label className="block text-red-600 mb-1">Organisation Name</label>
            <input
              type="text"
              name="organisationName"
              className="w-full border border-red-400 rounded px-3 py-2"
              value={formData.organisationName}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Country */}
        <div>
          <label className="block text-red-600 mb-1">Country</label>
          <select
            className="w-full border border-red-400 rounded px-3 py-2"
            name="country"
            value={formData.location.country}
            onChange={handleChange}
          >
            {Country.getAllCountries().map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-red-600 mb-1">State</label>
          <select
            className="w-full border border-red-400 rounded px-3 py-2"
            name="state"
            value={formData.location.state}
            onChange={handleChange}
          >
            {State.getStatesOfCountry(formData.location.country).map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-red-600 mb-1">City</label>
          <select
  className="w-full border border-red-400 rounded px-3 py-2"
  name="city"
  value={formData.location.city}
  onChange={handleChange}
>
  {City.getCitiesOfState(
    formData.location.country,
    formData.location.state
  ).map((c) => (
    <option key={c.name} value={c.name}>
      {c.name}
    </option>
  ))}
</select>

        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-red-600">
            Street Address / Location
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress || ""}
            onChange={(e) =>
              setFormData({ ...formData, streetAddress: e.target.value })
            }
            className="mt-1 block w-full border border-red-500 rounded px-3 py-2"
            placeholder="e.g. 56 Park Street"
            required
          />
        </div>

        
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
          onChangePassword={handlePasswordChange}
        />

        <div className="col-span-1 md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded"
          >
            Update Profile
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full mt-2 bg-red-500 text-black py-2 rounded-lg hover:bg-red-700"
          >
            Back to Home
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
