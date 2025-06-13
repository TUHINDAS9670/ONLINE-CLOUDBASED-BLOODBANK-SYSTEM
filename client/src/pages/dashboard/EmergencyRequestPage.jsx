import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import API from "../../services/API";
import { Link } from "react-router-dom";

const EmergencyRequestForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    bloodGroup: "",
    urgency: "",
    quantity: "",
    country: "IN",
    state: "",
    city: "",
    manualAddress: "", // ✅ add this

    document: null,
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const selectedStates = State.getStatesOfCountry(formData.country);
    setStates(selectedStates);
    setFormData((prev) => ({ ...prev, state: "", city: "" }));
  }, [formData.country]);

  useEffect(() => {
    if (formData.state) {
      const selectedCities = City.getCitiesOfState(
        formData.country,
        formData.state
      );
      setCities(selectedCities);
    }
  }, [formData.state]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("bloodGroup", formData.bloodGroup);
    formDataToSend.append("urgency", formData.urgency);
    formDataToSend.append("quantity", formData.quantity);
    formDataToSend.append("document", formData.document);
    formDataToSend.append(
      "address",
      JSON.stringify({
        country: formData.country,
        state: formData.state,
        city: formData.city,
        manualAddress: formData.manualAddress, // ✅ include here
      })
    );

    console.log("FormData values:");
    console.log("fullName:", formData.fullName);
    console.log("email:", formData.email);
    console.log("phone:", formData.phone);
    console.log("bloodGroup:", formData.bloodGroup);
    console.log("urgency:", formData.urgency);
    console.log("quantity:", formData.quantity);
    console.log("country:", formData.country);
    console.log("state:", formData.state);
    console.log("city:", formData.city);
    console.log("document:", formData.document);

    try {
      console.log("Submitting Data:", formDataToSend);

      const res = await API.post("/emergency/submit", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success(`Request submitted! Your ID: ${res.data.patientId}`);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          bloodGroup: "",
          urgency: "",
          quantity: "",
          country: "IN",
          state: "",
          city: "",
          document: null,
        });
        // reset
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit");
      console.error("Emergency request error:", err.message);
      console.error("Full error object:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-10 mt-10 mb-20 border border-red-500">

      <motion.h2
        className="text-3xl font-bold text-center text-red-600 mb-4"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🚨 Emergency Blood Request Form
      </motion.h2>

     <form onSubmit={handleSubmit} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Full Name */}
    <div>
      <label className="text-red-600 font-semibold">Full Name</label>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      />
    </div>

    {/* Email */}
    <div>
      <label className="text-red-600 font-semibold">Email</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      />
    </div>

    {/* Phone */}
    <div>
      <label className="text-red-600 font-semibold">Phone</label>
      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      />
    </div>

    {/* Blood Group */}
    <div>
      <label className="text-red-600 font-semibold">Blood Group</label>
      <select
        name="bloodGroup"
        value={formData.bloodGroup}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      >
        <option value="">Select</option>
        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
          <option key={bg} value={bg}>
            {bg}
          </option>
        ))}
      </select>
    </div>

    {/* Urgency */}
    <div>
      <label className="text-red-600 font-semibold">Urgency</label>
      <select
        name="urgency"
        value={formData.urgency}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      >
        <option value="">Select</option>
        <option value="Low">Low (24 hrs)</option>
        <option value="Moderate">Medium (12 hrs)</option>
        <option value="High">High (Within 6 hrs)</option>
        <option value="Critical">Critical (ASAP)</option>
      </select>
    </div>

    {/* Quantity */}
    <div>
      <label className="text-red-600 font-semibold">Quantity (in units)</label>
      <input
        type="number"
        name="quantity"
        value={formData.quantity}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        min="1"
        required
      />
    </div>

    {/* Country */}
    <div>
      <label className="text-red-600 font-semibold">Country</label>
      <select
        name="country"
        value={formData.country}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
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
      <label className="text-red-600 font-semibold">State</label>
      <select
        name="state"
        value={formData.state}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      >
        <option value="">Select</option>
        {states.map((s) => (
          <option key={s.isoCode} value={s.isoCode}>
            {s.name}
          </option>
        ))}
      </select>
    </div>

    {/* City */}
    <div>
      <label className="text-red-600 font-semibold">City</label>
      <select
        name="city"
        value={formData.city}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        required
      >
        <option value="">Select</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>

    {/* Manual Address */}
    <div className="md:col-span-2">
      <label className="text-red-600 font-semibold">Full Address (optional)</label>
      <input
        type="text"
        name="manualAddress"
        value={formData.manualAddress}
        onChange={handleChange}
        className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        placeholder="Flat/Street/Area/Pin code etc."
      />
    </div>
  </div>

  {/* Document Upload */}
  <div>
    <label className="block text-sm text-red-600 font-medium mb-1 mt-6">
      Upload Hospital Verification Document
    </label>
    <input
      type="file"
      name="document"
      accept="image/*,application/pdf"
      required
      className="w-full border border-red-500 px-3 py-2 rounded bg-white"
      onChange={(e) =>
        setFormData({ ...formData, document: e.target.files[0] })
      }
    />
  </div>

  {/* Submit Button */}
  <div className="text-center pt-6">
    <button
      type="submit"
      className="bg-black text-white px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
    >
      Submit Emergency Request
    </button>
  </div>
  <div className="text-center pt-6">
    <Link
      to="/"
      className="bg-red-600 text-black px-8 py-3 rounded-lg hover:bg-red-700 transition duration-300 shadow-md"
    >
     Back to Home
    </Link>
  </div>
</form>

    </div>
  );
};

export default EmergencyRequestForm;
