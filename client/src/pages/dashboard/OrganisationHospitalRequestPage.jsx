import React, { useEffect, useState } from "react";
import API from "../../services/API";
import { toast } from "react-toastify";
import Layout from "../../components/shared/layout/Layout";

const OrganisationHospitalRequestsPage = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await API.post("/hospital-requests/incoming-requests");
      // console.log(res)
      setRequests(res.data); // ✅ assumes array is under `data`
      console.log(res.data);
    } catch (error) {
      toast.error("Failed to load hospital requests");
    }
  };

  const handleStatusChange = async (id, status,remarks) => {
    try {
      await API.put(`/hospital-requests/request/${id}/status`, { status,remarks });
      toast.success(`Request ${status}`);
      setTimeout(fetchRequests, 300); // slight delay for UI sync
    } catch (err) {
  const errorMessage = err.response?.data?.message || "Failed to approve request";
  toast.error(errorMessage); // Shows: “Not enough blood available...”
}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Layout>
      <div className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Incoming Hospital Requests</h1>
        <table className="min-w-full border table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Hospital</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Location</th>
              <th className="border p-2">Blood Group</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(requests) &&
              requests.map((req) => (
                // your JSX

                <tr key={req._id}>
                  <td className="p-2 border">{req.hospitalName || "N/A"}</td>
                  <td className="p-2 border">
                    {req.hospital?.phoneNumber || "N/A"}
                  </td>
                  <td className="p-2 border">
                    {req.hospital?.location?.city},{" "}
                    {req.hospital?.location?.state},{" "}
                    {req.hospital?.location?.location}
                  </td>
                  <td className="border p-2">{req.bloodGroup}</td>
                  <td className="border p-2">{req.quantity} ml</td>
                  <td className="border p-2">{req.reason || "N/A"}</td>
                  <td className="border p-2">{req.status}</td>
                  <td className="border p-2">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(req._id, "approved")
                          }
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Approve
                        </button>
                        <select
  onChange={(e) =>
    handleStatusChange(req._id, "rejected", e.target.value)
  }
  className="border px-2 py-1 text-sm"
>
  <option value="">Reject With Reason</option>
  <option value="Insufficient blood stock">Insufficient blood stock</option>
  <option value="Invalid request details">Invalid request details</option>
  <option value="Duplicate request">Duplicate request</option>
</select>

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

export default OrganisationHospitalRequestsPage;
