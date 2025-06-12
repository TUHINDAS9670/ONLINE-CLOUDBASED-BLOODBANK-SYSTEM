import React, { useEffect, useState } from "react";
import API from "../../services/API";

const EmergencyRequestStatusView = () => {
  const [requests, setRequests] = useState({ approved: [], rejected: [] });

  const fetchRequests = async () => {
    try {
      const { data } = await API.get("/api/v1/emergency-request/all");
      const approved = data?.requests?.filter((r) => r.status === "Approved") || [];
      const rejected = data?.requests?.filter((r) => r.status === "Rejected") || [];
      setRequests({ approved, rejected });
    } catch (error) {
      console.error("Failed to load request history:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const RequestCard = ({ request }) => (
    <div className="bg-white rounded-lg shadow p-4 border">
      <p><strong>Name:</strong> {request.fullName}</p>
      <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
      <p><strong>Urgency:</strong> {request.urgency}</p>
      <p><strong>Location:</strong> {request.address?.state}, {request.address?.city}</p>
      <p><strong>Status:</strong> <span className={`font-semibold ${request.status === "Approved" ? "text-green-600" : "text-red-600"}`}>{request.status}</span></p>
      {request.adminRemarks && (
        <p><strong>Remarks:</strong> {request.adminRemarks}</p>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Emergency Request History</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-green-600 mb-2">✅ Approved Requests</h3>
          <div className="space-y-4">
            {requests.approved.length ? requests.approved.map((req) => (
              <RequestCard key={req._id} request={req} />
            )) : <p className="text-gray-500">No approved requests found.</p>}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">❌ Rejected Requests</h3>
          <div className="space-y-4">
            {requests.rejected.length ? requests.rejected.map((req) => (
              <RequestCard key={req._id} request={req} />
            )) : <p className="text-gray-500">No rejected requests found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyRequestStatusView;
