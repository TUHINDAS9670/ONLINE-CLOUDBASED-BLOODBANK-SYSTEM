import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const DonationRequestPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [organisations, setOrganisations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    bloodGroup: "",
    disease: "",
    organisationId: "",
    quantity: "",
  });

  const fetchOrganisations = async () => {
    try {
      const res = await API.get("/admin/org-list");
      if (res.data.success) setOrganisations(res.data.orgData);
    } catch (error) {
      toast.error("Failed to load organisations");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get("/donations/my-requests");
      console.log(res.data)
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
      bloodGroup: user.bloodGroup, // ✅ Inject user's blood group
    });
    toast.success("Request submitted");
    setFormData({ bloodGroup: "", disease: "", organisationId: "", quantity: "" });
    fetchRequests();
  } catch (error) {
    toast.error("Error sending request");
  }
  finally{
    // console.log(formData)
    // console.log(organisations)
    console.log("request",requests)
  }
};

  
  useEffect(() => {
    fetchOrganisations();
    fetchRequests();
  }, []);
  const handleEdit = async (req) => {
    const quantity = prompt("Update Quantity", req.quantity);
    const disease = prompt("Update Disease", req.disease || "");
  
    if (!quantity) return;
  
    try {
      await API.put(`/donations/request/${req._id}`, {
        quantity,
        disease,
        organisationId:req.organisation?._id,
      });
      fetchRequests();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update request.");
    }
  };
  
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
  
    try {
      await API.delete(`/donations/request/${id}`);
      fetchRequests(); // refresh
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete request.");
    }
  };
  

  // Prevent rendering if user info is not ready
  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Request Blood Donation</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
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
            onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
            className="border p-2 rounded"
          />

          <select
            value={formData.organisationId}
            onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
            className="border p-2 rounded"
            required
          >
            <option value="">Select Organisation</option>
            {organisations.map((org) => (
              <option key={org._id} value={org._id}>{org.organisationName || org.name}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity (ml)"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
            Submit Request
          </button>
        </form>

        <div className="mt-8">
  <h2 className="font-semibold mb-2">Your Requests</h2>
  <table className="min-w-full border table-auto">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="p-2 border">Blood Group</th>
        <th className="p-2 border">Quantity</th>
        <th className="p-2 border">Organisation</th>
        <th className="p-2 border">Disease</th>
        <th className="p-2 border">Status</th>
        <th className="p-2 border">Actions</th> {/* ✅ Add Actions column */}
      </tr>
    </thead>
    <tbody>
      {requests.map((req) => (
        <tr key={req._id}>
          <td className="p-2 border">{req.bloodGroup}</td>
          <td className="p-2 border">{req.quantity} ml</td>
          <td className="p-2 border">{req.organisation.organisationName ||"N/A"}</td>
          <td className="p-2 border">{req.disease|| "N/A"}</td>
          <td className="p-2 border">{req.status}</td>
          <td className="p-2 border">
            {req.status === "pending" && (
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 text-white px-2 py-1 rounded text-sm"
                  onClick={() => handleEdit(req)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
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
