import React, { useState } from "react";
import API from "../../../services/API";

const EmergencyRequestModal = ({ onClose }) => {
  const [step, setStep] = useState("choice"); // choice | new | track
  const [requestId, setRequestId] = useState("");
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "accepted_by_org":
      return "bg-green-600";
    case "rejected_by_org":
      return "bg-red-600";
    default:
      return "bg-gray-500";
  }
};

  // const handleTrack = () => {
  //   if (requestId.trim()) {
  //     window.location.href = `/emergency/track/${requestId.trim()}`;
  //   }
  // };
  const handleTrack = async () => {
    if (!requestId.trim()) return;
    try {
      setLoading(true);
const res = await API.get(`/emergency/get-by-patient-id/${requestId.trim()}`);
      setRequest(res.data.request);
      setError("");
    } catch (err) {
      setRequest(null);
      setError("No request found with that ID.");
    } finally {
      setLoading(false);
      console.log(request)
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg relative animate-fade-in-down">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>

        {step === "choice" && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Emergency Blood Request
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Choose how you want to proceed:
            </p>
            <button
              onClick={() => setStep("track")}
              className="w-full mb-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
            >
              Track Existing Request
            </button>
            <button
              onClick={() => (window.location.href = "/emergency/new")}
              className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
            >
              New Emergency Request
            </button>
          </div>
        )}

        {step === "track" && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-red-600">
              Track Request Status
            </h3>

            {!request && (
              <>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded mb-4 text-black"
                  placeholder="Enter your request ID"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <div className="flex justify-between">
                  <button
                    onClick={() => setStep("choice")}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleTrack}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                  >
                    {loading ? "Tracking..." : "Track"}
                  </button>
                </div>
              </>
            )}

            {request && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mt-4 border shadow animate-fade-in">
  <h4 className="text-lg font-bold text-gray-700 dark:text-white mb-2">
    🩸 Request Details
  </h4>
  <ul className="text-gray-700 dark:text-gray-200 space-y-1 text-sm">
    <li><strong>Request ID:</strong> {request.patientId}</li>
    <li><strong>Created At:</strong> {new Date(request.requestTimestamp).toLocaleString()}</li>
   <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
  <p>
    <strong>Admin Approval:</strong>{" "}
    <span className={`font-semibold ${request.approvedByAdmin ? "text-green-600" : "text-yellow-600"}`}>
      {request.approvedByAdmin ? "Approved" : "Pending"}
    </span>
  </p>
  <p>
    <strong>BloodBank Approval:</strong>{" "}
    <span className={`font-semibold ${request.approvedByOrganisation ? "text-green-600" : "text-yellow-600"}`}>
      {request.approvedByOrganisation ? "Approved" : "Pending"}
    </span>
  </p>
  <p>
    <strong>Verified:</strong>{" "}
    <span className={`font-semibold ${request.verified ? "text-green-600" : "text-red-600"}`}>
      {request.verified ? "Verified" : "Not Verified"}
    </span>
  </p>
</div>

    <li><strong>Blood Group:</strong> {request.bloodGroup}</li>
    <li><strong>Urgency:</strong> {request.urgency}</li>
    <li><strong>Quantity:</strong> {request.quantity}</li>
    <li><strong>Location:</strong> {request.address?.city}, {request.address?.state}</li>

    {request.handledBy?.name && (
      <>
        <li><strong>Handled By:</strong> {request.handledBy.name}</li>
        <li><strong>Contact:</strong> {request.handledBy.contact}</li>
        <li><strong>Email:</strong> {request.handledBy.email}</li>
      </>
    )}

    {request.responseETA && (
      <li><strong>Estimated Response:</strong> {request.responseETA}</li>
    )}
  </ul>

  <a
    href={`http://localhost:3000/view-document/${request.documentUrl?.split("/").pop()}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-3 text-blue-600 underline"
  >
    📄 View Hospital Document
  </a>

  {/* Visual timeline (fake progress UI) */}
  <div className="mt-5">
    <h5 className="font-semibold text-gray-600 dark:text-white mb-2">🕐 Progress</h5>
    <div className="flex justify-between text-xs text-white">
      {["Submitted", "Under Review", "Accepted", "Fulfilled"].map((step, idx) => {
        const isComplete = (
          (request.status === "pending" && idx <= 0) ||
          (request.status === "accepted_by_org" && idx <= 2) ||
          (request.status === "fulfilled" && idx <= 3)
        );
        return (
          <div
            key={idx}
            className={`flex-1 text-center py-1 px-2 rounded ${isComplete ? "bg-green-600" : "bg-gray-400"} mx-1`}
          >
            {step}
          </div>
        );
      })}
    </div>
  </div>

  <button
    onClick={() => {
      setRequest(null);
      setRequestId("");
    }}
    className="mt-4 block w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded"
  >
    🔁 Track Another Request
  </button>
</div>

            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyRequestModal;
