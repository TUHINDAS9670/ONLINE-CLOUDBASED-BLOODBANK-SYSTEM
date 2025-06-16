import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../../services/API";
import Layout from "../../components/shared/layout/Layout";

const AdminEmergencyRequests = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.post("/emergency/admin-pending", {}); // ✅ send empty body so req.body exists
      setRequests(res.data.requests);
      console.log(res.data.requests);
    } catch (error) {
      toast.error("Failed to fetch pending requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      await API.put(
        `/emergency/admin/update-status/${id}`,
        { status: action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(
        `Request ${action === "admin_approved" ? "approved" : "rejected"}`
      );
      fetchRequests(); // Refresh list
    } catch (err) {
      toast.error("Action failed");
    }
  };

  return (
    <Layout>
      <div className="p-6 mt-20 bg-white text-black">
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Pending Emergency Requests
        </h1>
        {requests.length === 0 ? (
          <p className="text-gray-600">No pending requests.</p>
        ) : (
          <div className="grid gap-4">
            {requests.map((req) => (
              <div
                key={req._id}
                className="border p-4 rounded-xl shadow bg-red-50"
              >
                <h2 className="text-xl font-semibold">
                  {req.fullName} - {req.bloodGroup}
                </h2>
                <p>Email: {req.email}</p>
                <p>Phone: {req.phone}</p>
                <p>Urgency: {req.urgency}</p>
                <p>Quantity: {req.quantity} units</p>
                <p>
                  <strong>Address:</strong>{" "}
                  {`${req.address.manualAddress}, ${req.address.city}, ${req.address.state}, ${req.address.country}`}
                </p>

                <a
                href={req.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleAction(req._id, "admin_approved")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "rejected_by_admin")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminEmergencyRequests;
