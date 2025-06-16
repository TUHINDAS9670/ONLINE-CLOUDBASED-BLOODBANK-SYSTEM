import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import API from "../../services/API";

const OrganisationEmergencyRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  console.log(user);
  
// Adjust based on your auth setup

  useEffect(() => {
    const fetchRequests = async () => {
  try {
    const res = await API.get(`/emergency-request/handled-by-org/${user._id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    console.log("Full response:", res);
    console.log("res.data:", res.data);
    console.log("res.data.data:", res.data?.data);

    if (res.data?.success) {
      setRequests(res.data.data); // Correct access
    } else {
      toast.error("No data found.");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    toast.error("Failed to fetch request history");
  } finally {
    setLoading(false);
  }
};


    if (user) fetchRequests();
  }, [user]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center text-red-600">
        Approved & Rejected Emergency Requests
      </h1>

      {requests.length === 0 ? (
        <p className="text-center">No requests found.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req._id}
            className="bg-white shadow-md rounded p-4 mb-4 border-l-4"
            style={{
              borderColor:
                req.status === "accepted_by_org" ? "#16a34a" : "#dc2626",
            }}
          >
            <h2 className="font-semibold text-lg">{req.fullName}</h2>
            <p>
              <strong>Patient ID:</strong> {req.patientId}
            </p>
            <p>
              <strong>Blood Group:</strong> {req.bloodGroup}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 text-sm rounded text-white ${
                  req.status === "accepted_by_org"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {req.status.replace(/_/g, " ")}
              </span>
            </p>
            <p>
              <strong>Urgency:</strong> {req.urgency}
            </p>
            <p>
              <strong>Requested On:</strong>{" "}
              {new Date(req.requestTimestamp).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default OrganisationEmergencyRequestHistory;
