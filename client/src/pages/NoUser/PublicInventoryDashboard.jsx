import React, { useEffect, useState } from "react";
import API from "../../services/API";
import { Country, State, City } from "country-state-city";
import "tailwindcss/tailwind.css";

const PublicInventoryDashboard = () => {
  const [bloodGroup, setBloodGroup] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [bloodBanks, setBloodBanks] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, [bloodGroup, stateFilter, cityFilter]);

  const fetchInventory = async () => {
    try {
    const res= await API.post("/inventory/public-inventory", {
  bloodGroup,
  state: stateFilter,
  city: cityFilter,
});

      console.log(res)
      setBloodBanks(res.data || []);
    } catch (error) {
      console.error("Error fetching inventory", error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <h1 className="text-3xl font-bold text-center text-red-600 mb-6 animate-fade-in">
        Live Blood Inventory
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border-red-500 border px-4 py-2 rounded focus:outline-none"
        >
          <option value="">Select Blood Group</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <select
          value={stateFilter}
          onChange={(e) => {
            setStateFilter(e.target.value);
            setCityFilter(""); // reset city on state change
          }}
          className="border-red-500 border px-4 py-2 rounded"
        >
          <option value="">Filter by State</option>
          {State.getStatesOfCountry("IN").map((s) => (
            <option key={s.isoCode} value={s.name}>{s.name}</option>
          ))}
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border-red-500 border px-4 py-2 rounded"
        >
          <option value="">Filter by City</option>
          {stateFilter &&
            City.getCitiesOfState("IN", State.getStatesOfCountry("IN").find(s => s.name === stateFilter)?.isoCode)
              .map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
        </select>
      </div>

      <div className="overflow-x-auto animate-fade-in">
        <table className="min-w-full bg-white border border-red-300 shadow">
          <thead className="bg-red-600 text-white">
            <tr>
              <th className="p-2 border">Blood Group</th>
              <th className="p-2 border">Available (ml)</th>
              <th className="p-2 border">Blood Bank</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Contact</th>
            </tr>
          </thead>
          <tbody>
            {bloodBanks.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-4">No data available</td>
              </tr>
            ) : (
              bloodBanks.map((item, index) => (
                <tr key={index} className="hover:bg-red-50 transition">
                  <td className="p-2 border">{item.bloodGroup}</td>
                  <td className="p-2 border">{item.available} ml</td>
                  <td className="p-2 border">{item.bloodBankName}</td>
                  <td className="p-2 border">{item.address}, {item.city}, {item.state}</td>
                  <td className="p-2 border">{item.contact}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicInventoryDashboard;
