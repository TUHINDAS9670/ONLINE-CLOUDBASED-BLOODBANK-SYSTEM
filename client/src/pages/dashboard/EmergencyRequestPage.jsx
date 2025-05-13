import React, { useState, useEffect } from "react";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EmergencyRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    urgency: "",
    quantity: "",
   country: "IN",  // default India ISO code
state: "",      // will hold ISO code of state

    city: "",
    location: "",
    document: null,
  });

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [existingRequests, setExistingRequests] = useState([]);

  // Load States based on Country
  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN");
    setStates(allStates);
  }, []);

  // Load Cities based on State
  useEffect(() => {
    if (formData.state) {
   
      const allCities = City.getCitiesOfState(formData.country, formData.state);
      setCities(allCities);
    }
  }, [formData.state, states]);

  // Handle input
  const handleFileChange = (e) => {
    setFormData({ ...formData, document: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Form submitted successfully!");
    // FormData for uploading file
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await axios.post("/api/emergency/new-request", data);
      if (res.data.success) {
        setPatientId(res.data.patientId);
        setExistingRequests([res.data.request]);
        toast.success("Request submitted!");
      }
    } catch (err) {
      toast.error("Submission failed");
    }
  };

  return (
    <div className="p-4 mt-20">
      <h1 className="text-2xl font-bold mb-4">Emergency Blood Request</h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-6 rounded shadow"
      >
         <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
       
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="border p-2 rounded"
          required
        />

        {/* Blood Group */}
        <select
          value={formData.bloodGroup}
          onChange={(e) =>
            setFormData({ ...formData, bloodGroup: e.target.value })
          }
          className="border p-2 rounded"
          required
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        {/* Urgency */}
        <select
          value={formData.urgency}
          onChange={(e) =>
            setFormData({ ...formData, urgency: e.target.value })
          }
          className="border p-2 rounded"
          required
        >
          <option value="">Urgency Level</option>
          <option value="urgent">Urgent (within 6 hrs)</option>
          <option value="24hrs">Within 24 Hours</option>
          <option value="48hrs">Within 48 Hours</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          placeholder="Quantity (ml)"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        {/* Country */}
        <select
  value={formData.country}
  onChange={(e) => {
    setFormData({ ...formData, country: e.target.value, state: "", city: "" });
    const statesList = State.getStatesOfCountry(e.target.value);
    setStates(statesList);
    setCities([]);
  }}
  className="border p-2 rounded"
  required
>
  <option value="">Select Country</option>
  {Country.getAllCountries().map((country) => (
    <option key={country.isoCode} value={country.isoCode}>
      {country.name}
    </option>
  ))}
</select>


        {/* State */}
        <select
  value={formData.state}
  onChange={(e) => {
    setFormData({ ...formData, state: e.target.value, city: "" });
    const citiesList = City.getCitiesOfState(formData.country, e.target.value);
    setCities(citiesList);
  }}
  className="border p-2 rounded"
  required
>
  <option value="">Select State</option>
  {states.map((state) => (
    <option key={state.isoCode} value={state.isoCode}>
      {state.name}
    </option>
  ))}
</select>


        {/* City */}
        <select
  value={formData.city}
  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
  className="border p-2 rounded"
  required
>
  <option value="">Select City</option>
  {cities.map((city) => (
    <option key={city.name} value={city.name}>
      {city.name}
    </option>
  ))}
</select>


        {/* Location */}
        <input
          type="text"
          placeholder="Street / Area"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        {/* Upload Document */}
       
         <label htmlFor="document" className="ml-1 font-semibold ">
          Upload Hospital Verified Doucment(PDF or Image)
           </label>
           <input
           name="document"
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="border p-2 rounded col-span-2"
          required
        />
       
       
       

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold p-2 rounded col-span-2"
        >
          Submit Request
        </button>
      </form>

      {/* Patient ID Popup */}
      {patientId && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 border border-green-400 rounded">
          <h3 className="font-bold text-lg">Your Patient ID:</h3>
          <p className="text-xl">{patientId}</p>
          <p className="text-sm text-gray-600">
            Please save this ID to track your request status in the future.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmergencyRequestForm;
