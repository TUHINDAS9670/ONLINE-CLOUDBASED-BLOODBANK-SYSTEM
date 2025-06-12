import React, { useEffect, useState } from "react";
import API from "../../services/API";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
import { useSelector } from "react-redux";
import Layout from '../../components/shared/layout/Layout'

const OrganisationEmergencyRequests = () => {
  const [requests, setRequests] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

const [filters, setFilters] = useState({
  bloodGroup: "",
  urgency: "",
  city: "",
});
  const  {user}  = useSelector((state) => state.auth);

const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      const [stateName, isoCode] = value.split("|");
      setFilters((prev) => ({ ...prev, state: stateName, city: "" }));
      setOrgStateCode(isoCode);

      const cities = City.getCitiesOfState("IN", isoCode) || [];
      setCityOptions(cities.map((c) => c.name));
    }
  };


const convertAddressCodesToNames = (request) => {
  const countryObj = Country.getCountryByCode(request.address?.country);
  const stateObj = State.getStateByCodeAndCountry(request.address?.state, request.address?.country);
  
    return {
      ...request,
      address: {
        ...request.address,
        country: countryObj?.name || request.address?.country,
        state: stateObj?.name || request.address?.state,
      }
    };
  };
  
  const fetchRequests = async () => {
  try {
    const res = await API.post("/emergency/organisation/view-requests", {});
    const transformedRequests = res.data.requests.map(convertAddressCodesToNames);
    setRequests(transformedRequests);

    // Fetch organisation user details
    // const userRes = await API.get("/auth/get-current-user");
    // const user = userRes.data?.user;
    console.log(user)

    const orgStateCode = user?.location?.state;
    if (orgStateCode) {
      const cities = City.getCitiesOfState("IN", orgStateCode);
      setCityOptions(cities.map((c) => c.name));
    }

  } catch (err) {
    toast.error("Failed to load requests");
  }
};

  useEffect(() => {
    fetchRequests();
  }, []);
  const filteredRequests = requests.filter((req) => {
    return (
      (filters.bloodGroup ? req.bloodGroup === filters.bloodGroup : true) &&
      (filters.urgency ? req.urgency === filters.urgency : true) &&
      (filters.city ? req.address?.city === filters.city : true)
    );
  });
  const handleDecision = async (requestId, action) => {
  try {
    const res = await API.put(`/emergency/organisation/update/${requestId}`, {
      userId: localStorage.getItem("userId"),
      status: action === "accept" ? "accepted_by_org" : "rejected_by_org",
    });

    toast.success(`Request ${action}ed successfully`);
    fetchRequests(); // Refresh list
  } catch (err) {
    toast.error(`Failed to ${action} request`);
  }
};


  return (
      <Layout>
    <div className="p-6 mt-20">
      <h1 className="text-2xl font-bold mb-4 text-red-700">Emergency Requests</h1>
        {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <select name="bloodGroup" onChange={handleFilterChange} value={filters.bloodGroup} className="p-2 border rounded">
          <option value="">All Blood Groups</option>
          {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
            <option key={group} value={group}>{group}</option>
          ))}
        </select>

        <select name="urgency" onChange={handleFilterChange} value={filters.urgency} className="p-2 border rounded">
          <option value="">All Urgency Levels</option>
          {["Low", "Moderate", "High", "Critical"].map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>



        <select
          name="city"
          onChange={handleFilterChange}
          value={filters.city}
          className="p-2 border rounded"
        >
          <option value="">All Cities</option>
          {cityOptions.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {filteredRequests.map((req) => (
        <div key={req._id} className="border p-4 rounded bg-white mb-4 shadow">
          <p><strong>Patient ID:</strong> {req.patientId}</p>
          <p><strong>Name:</strong> {req.fullName}</p>
          <p><strong>Email:</strong> {req.email}</p>
          <p><strong>Phone:</strong> {req.phone}</p>
          <p><strong>Blood Group:</strong> {req.bloodGroup}</p>
          <p><strong>Urgency:</strong> {req.urgency}</p>
          <p><strong>Quantity:</strong> {req.quantity}</p>
          <p><strong>Address:</strong> {`${req.address?.manualAddress}, ${req.address?.city}, ${req.address?.state}, ${req.address?.country}`}</p>
          <a
            href={`http://localhost:3000/view-document/${req.documentUrl.split("/").pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mt-2 inline-block"
          >
            View Document
          </a>
          <div className="flex gap-4 mt-2">
  <button
    onClick={() => handleDecision(req._id, "accept")}
    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
  >
    Accept
  </button>
  <button
    onClick={() => handleDecision(req._id, "reject")}
    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
  >
    Reject
  </button>
</div>

        </div>
        
      ))}
      
    </div>
    </Layout>
  );
};


export default OrganisationEmergencyRequests;
