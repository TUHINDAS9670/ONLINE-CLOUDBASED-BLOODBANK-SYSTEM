import React, { useState } from "react";

const EmergencyRequestModal = ({ onClose }) => {
  const [step, setStep] = useState("choice"); // choice | new | track
  const [requestId, setRequestId] = useState("");

  const handleTrack = () => {
    if (requestId.trim()) {
      window.location.href = `/emergency/track/${requestId.trim()}`;
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
            <h2 className="text-2xl font-bold mb-4 text-red-600">Emergency Blood Request</h2>
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
              onClick={() => window.location.href = "/emergency/new"}
              className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded"
            >
              New Emergency Request
            </button>
          </div>
        )}

        {step === "track" && (
          <div>
            <h3 className="text-xl font-semibold mb-3 text-red-600">Track Request Status</h3>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded mb-4"
              placeholder="Enter your request ID"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
            />
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
                Track
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyRequestModal;
