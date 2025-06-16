import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DonationRequestPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [cooldownDaysLeft, setCooldownDaysLeft] = useState(0);

  const [organisations, setOrganisations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    disease: "",
    organisationId: "",
    quantity: "",
  });

  // const fetchOrganisations = async () => {
  //   try {
  //     const res = await API.get("/admin/org-list");
  //     if (res.data.success) setOrganisations(res.data.orgData);
  //   } catch (error) {
  //     toast.error("Failed to load organisations");
  //   }
  // };
  const checkCooldown = async () => {
  try {
    const res = await API.get("/donations/last-fulfilled"); // Create this API
    if (res.data?.lastDonationDate) {
      const last = new Date(res.data.lastDonationDate);
      const now = new Date();
      const diffDays = Math.floor((now - last) / (1000 * 60 * 60 * 24));
      const daysLeft = 90 - diffDays;
      if (daysLeft > 0) {
        setCooldownDaysLeft(daysLeft);
      }
      console.log(daysLeft);
      
    }
  } catch (error) {
    console.error("Cooldown check failed", error);
  }
};

  const fetchOrganisations = async () => {
    try {
      const res = await API.post("/donations/filter-orgs", {
        country: user.location.country,
        state: user.location.state,
      });
      if (res.data.success) {
        setOrganisations(res.data.orgData);
      } else {
        toast.error("Failed to load organisations");
      }
    } catch (error) {
      toast.error("Failed to load organisations");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get("/donations/my-requests");
      setRequests(res.data);
    } catch (error) {
      toast.error("Error fetching requests");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/donations/request", {
        ...formData,
        bloodGroup: user.bloodGroup,
      });
      toast.success("Request submitted");
      setFormData({
        bloodGroup: "",
        disease: "",
        organisationId: "",
        quantity: "",
      });
      fetchRequests();
    } catch (error) {
      toast.error("Error sending request");
    } finally {
      console.log("request", requests);
    }
  };

  useEffect(() => {
    fetchOrganisations();
    fetchRequests();
    checkCooldown();
  }, []);

  const handleEdit = async (req) => {
    const quantity = prompt("Update Quantity", req.quantity);
    const disease = prompt("Update Disease", req.disease || "");
    if (!quantity) return;
    try {
      await API.put(`/donations/request/${req._id}`, {
        quantity,
        disease,
        organisationId: req.organisation?._id,
      });
      fetchRequests();
    } catch (error) {
      alert("Failed to update request.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;
    try {
      await API.delete(`/donations/request/${id}`);
      fetchRequests();
    } catch (error) {
      alert("Failed to delete request.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-4 mt-20 animate-fade-in">
        <h1 className="text-xl font-bold mb-4 text-red-600">
          Request Blood Donation
        </h1>
{cooldownDaysLeft > 0 ? (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    You are in a cooldown period. Please wait <b>{cooldownDaysLeft} day(s)</b> before submitting another donation request.
  </div>
) : (
  <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded shadow border"
        >
          <input
            type="text"
            value={user.name || ""}
            disabled
            className="border p-2 rounded"
          />
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="border p-2 rounded"
          />
          <input
            type="text"
            value={user.bloodGroup}
            disabled
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Disease (optional)"
            value={formData.disease}
            onChange={(e) =>
              setFormData({ ...formData, disease: e.target.value })
            }
            className="border p-2 rounded"
          />

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
            className="bg-red-600 hover:bg-red-700 transition text-white p-2 rounded col-span-1 md:col-span-2"
          >
            Submit Request
          </button>
        </form>
)}

       

        <div className="mt-8 overflow-x-auto">
          <h2 className="font-semibold mb-2 text-lg text-gray-800">
            Your Requests
          </h2>
          <table className="min-w-full border text-sm table-auto shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-xs">
                <th className="p-2 border">Blood Group</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Organisation</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Disease</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border">{req.bloodGroup}</td>
                  <td className="p-2 border">{req.quantity} ml</td>
                  <td className="p-2 border">
                    {req.organisation?.organisationName || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {req.organisation?.phoneNumber || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {req.organisation?.email || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {req.organisation?.location.full || "N/A"}
                  </td>
                  <td className="p-2 border">{req.disease || "N/A"}</td>
                  <td className="p-2 border capitalize">
                    {req.status}
                    {req.status === "rejected" && req.remarks ? (
                      <div className="text-red-600 text-xs mt-1 italic">
                        Reason: {req.remarks}
                      </div>
                    ) : null}
                  </td>

                  <td className="p-2 border">
                    {req.status === "fulfilled" && (
                      <div className="text-green-600 text-xs mt-1 italic">
                        Donation completed
                      </div>
                    )}
                    {req.status === "approved" && (
                      <div className="text-orange-600 text-xs mt-1 italic">
                        Donation Scheduled
                      </div>
                    )}

                    {["pending"].includes(
                      req.status
                    ) && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleEdit(req)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 transition text-white px-2 py-1 rounded text-xs"
                          onClick={() => handleDelete(req._id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default DonationRequestPage;
