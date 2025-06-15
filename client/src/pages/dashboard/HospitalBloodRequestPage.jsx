import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Country, State, City } from "country-state-city";
const HospitalBloodRequestPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [organisations, setOrganisations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    reason: "",
    organisationId: "",
    quantity: "",
    bloodGroup: "",
  });
  // useEffect(() => {
  //   if (user && user.location) {
  //     const { country, state } = user.location;

  //     // Try to resolve full state data using country-state-city
  //     const allStates = State.getStatesOfCountry(country || "IN");
  //     const matched = allStates.find(
  //       (s) =>
  //         s.name.toLowerCase() === state?.toLowerCase() ||
  //         s.isoCode.toLowerCase() === state?.toLowerCase()
  //     );

  //     const stateVariants = [];
  //     if (matched) {
  //       stateVariants.push(matched.name); // "West Bengal"
       
  //     } else if (state) {
  //       stateVariants.push(state); // fallback if no match
  //     }

  //     fetchOrganisations({
  //       country,
  //       stateVariants, // <-- send array of possible state values
  //     });

  //     fetchRequests();
  //   }
  // }, [user]);

  // const fetchOrganisations = async () => {
  //   try {
  //     const res = await API.get("/admin/org-list");
  //     if (res.data.success) {
  //       setOrganisations(res.data.orgData);
  //     } else {
  //       toast.error("Failed to load organisations");
  //     }
  //   } catch {
  //     toast.error("Failed to load organisations");
  //   }
  // };
 const [cities, setCities] = useState([]);
const [selectedCity, setSelectedCity] = useState("");

useEffect(() => {
  if (user && user.location) {
    const { country, state } = user.location;

    const matchedCountry = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === (country || "India").toLowerCase()
    );

    if (!matchedCountry) return;

    const allStates = State.getStatesOfCountry(matchedCountry.isoCode);
    const matchedState = allStates.find(
      (s) => s.name.toLowerCase() === state?.toLowerCase()
    );

    if (matchedState) {
      const cityList = City.getCitiesOfState(
        matchedCountry.isoCode,
        matchedState.isoCode
      );
      setCities(cityList);
    }

    const stateVariants = matchedState ? [matchedState.name] : [state];
    fetchOrganisations({
      country: matchedCountry.name,
      stateVariants,
    });

    fetchRequests();
  }
}, [user]);


  const fetchOrganisations = async (locationData) => {
    try {
      const res = await API.post(
        "/hospital-requests/filter-orgs",
        locationData
      );
      if (res.data.success) {
        setOrganisations(res.data.orgData);
        console.log(res.data.orgData);
      } else {
        toast.error("Failed to load organisations");
      }
    } catch (error) {
      toast.error("Failed to load organisations");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.post("/hospital-requests/my-requests");
      setRequests(res.data);
    } catch {
      toast.error("Error fetching requests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { reason, organisationId, quantity, bloodGroup } = formData;
    if (!reason || !quantity || !organisationId || !bloodGroup) {
      toast.error("All fields are required");
      return;
    }

    try {
      await API.post("/hospital-requests/request", {
        ...formData,
        hospitalName: user.hospitalName,
      });
      toast.success("Request submitted");
      setFormData({
        reason: "",
        organisationId: "",
        quantity: "",
        bloodGroup: "",
      });
      fetchRequests();
    } catch {
      toast.error("Error sending request");
    }
  };

  const handleEdit = async (req) => {
    const quantity = prompt("Update Quantity", req.quantity);
    const reason = prompt("Update Reason", req.reason || "");
    if (!quantity || !reason) return;

    try {
      await API.put(`/hospital-requests/request/${req._id}`, {
        quantity,
        reason,
        organisationId: req.organisation?._id,
      });
      fetchRequests();
    } catch {
      toast.error("Failed to update request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      await API.delete(`/hospital-requests/request/${id}`);
      toast.success("Request deleted");
      fetchRequests();
    } catch {
      toast.error("Failed to delete request");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="mt-24 px-4 md:px-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Request Blood
        </h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-lg"
        >
          <input
            type="text"
            value={user.hospitalName || ""}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="border p-2 rounded bg-gray-100"
          />
          <input
            type="text"
            placeholder="Reason for Request"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
  value={selectedCity}
  onChange={(e) => {
    const city = e.target.value;
    setSelectedCity(city);
    const { country, state } = user.location;

    const allStates = State.getStatesOfCountry(country || "IN");
    const matched = allStates.find(
      (s) =>
        s.name.toLowerCase() === state?.toLowerCase() ||
        s.isoCode.toLowerCase() === state?.toLowerCase()
    );

    const stateVariants = matched ? [matched.name] : [state];

    fetchOrganisations({
      country,
      stateVariants,
      city,
    });
  }}
  className="border p-2 rounded"
>
  <option value="">Filter by City/District (Optional)</option>
  {cities.map((c) => (
    <option key={c.name} value={c.name}>
      {c.name}
    </option>
  ))}
</select>

          <select
            value={formData.organisationId}
            onChange={(e) =>
              setFormData({ ...formData, organisationId: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            
            <option value="">Select Organisation</option>
            {organisations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.organisationName || org.name}, &nbsp; {org.location.full}
              </option>
            ))}
          </select>
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
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded col-span-1 md:col-span-2 transition"
          >
            Submit Request
          </button>
        </form>

        <div className="mt-10 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Your Requests
          </h2>
          <table className="min-w-full text-sm border border-gray-200 shadow-md rounded">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3 border">Quantity</th>
                <th className="p-3 border">Blood Group</th>
                <th className="p-3 border">Organisation</th>
                <th className="p-3 border">Organisation</th>
                <th className="p-3 border">Organisation</th>
                <th className="p-3 border">Organisation</th>
                <th className="p-3 border">Reason</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition">
                  <td className="p-3 border">{req.quantity} ml</td>
                  <td className="p-3 border">{req.bloodGroup}</td>
                  <td className="p-3 border">
                    {req.organisation?.organisationName || "N/A"}
                  </td>
                  <td className="p-3 border">
                    {req.organisation?.email || "N/A"}
                  </td>
                  <td className="p-3 border">
                    {req.organisation?.phoneNumber || "N/A"}
                  </td>
                  <td className="p-3 border">
                    {req.organisation?.location.full || "N/A"}
                  </td>
                  <td className="p-3 border">{req.reason || "N/A"}</td>
                  <td className="p-3 border capitalize">{req.status}</td>
                  <td className="p-3 border">
                    {req.status === "pending" && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs"
                          onClick={() => handleEdit(req)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                          onClick={() => handleDelete(req._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    {req.status === "rejected" && (
                      <p className="text-red-600 text-xs mt-1">
                        Reason: {req.remarks || "No reason provided"}
                      </p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default HospitalBloodRequestPage;
