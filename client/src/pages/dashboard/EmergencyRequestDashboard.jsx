import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import API from "../../services/API";

const EmergencyRequestDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await API.get("/api/v1/emergency-request/approved-rejected", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (data?.success) {
          setRequests(data.requests);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load requests.");
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-red-600 mb-6 animate-pulse text-center">
        Emergency Blood Requests – Dashboard
      </h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-xl border border-red-400">
        <table className="min-w-full text-sm text-center text-black">
          <thead className="bg-red-600 text-white uppercase">
            <tr>
              <th className="px-4 py-2">Patient</th>
              <th className="px-4 py-2">Blood Group</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2">Urgency</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Requested At</th>
              <th className="px-4 py-2">Document</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-4 text-red-500 font-semibold">
                  No approved or rejected requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req, index) => (
                <tr
                  key={index}
                  className={`border-b ${req.status === "approved" ? "bg-green-50" : "bg-red-50"}`}
                >
                  <td className="px-4 py-2 font-medium">{req.name}</td>
                  <td className="px-4 py-2">{req.bloodGroup}</td>
                  <td className="px-4 py-2">{req.email}<br />{req.phone}</td>
                  <td className="px-4 py-2 capitalize">{req.urgency}</td>
                  <td className="px-4 py-2">{req.quantity}</td>
                  <td className="px-4 py-2">{new Date(req.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    {req.document ? (
                      <a
                        href={req.document}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className={`px-4 py-2 font-bold text-${req.status === "approved" ? "green" : "red"}-600`}>
                    {req.status.toUpperCase()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmergencyRequestDashboard;
