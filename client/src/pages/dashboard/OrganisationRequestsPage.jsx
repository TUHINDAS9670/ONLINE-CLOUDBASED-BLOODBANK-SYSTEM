import React, { useEffect, useState } from "react";
import API from "../../services/API";
import { toast } from "react-toastify";
import Layout from "../../components/shared/layout/Layout";

const OrganisationRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/donations/incoming-requests");
      setRequests(res.data);
    } catch (error) {
      toast.error("Failed to load requests");
    }
  };
  const handleStatusChange = async (id, status) => {
    try {
      const res = await API.put(`/donations/request/${id}/status`, { status });
      toast.success(`Request ${status}`);
      
      // ✅ Force a slight delay before fetching
      setTimeout(() => {
        fetchRequests();
      }, 300);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  


  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Layout>
      <div className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Incoming Donation Requests</h1>
        <table className="min-w-full border table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Donor</th>
              <th className="border p-2">Blood Group</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Disease</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td className="border p-2">{req.donor?.name}</td>
                <td className="border p-2">{req.bloodGroup}</td>
                <td className="border p-2">{req.quantity} ml</td>
                <td className="border p-2">{req.disease || "N/A"}</td>
                <td className="border p-2">{req.status}</td>
                <td className="border p-2">
                  {req.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusChange(req._id, "approved")}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(req._id, "rejected")}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default OrganisationRequestsPage;
