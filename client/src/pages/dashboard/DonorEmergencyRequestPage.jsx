import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

const DonorEmergencyRequestPage = () => {
    const { user } = useSelector((state) => state.auth);
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myCommitments, setMyCommitments] = useState([]);

  useEffect(() => {
    fetchNearbyRequests();
    fetchMyCommitments();
  }, []);
  useEffect(() => {
  if (user?._id) {
    fetchNearbyRequests();
    fetchMyCommitments();
  }
}, [user]);


  const fetchNearbyRequests = async () => {
    try {
      const { data } = await axios.post('/api/emergency-donor/donor/nearby', { userId: user._id });
      setRequests(data);
    } catch (error) {
      toast.error('Failed to load emergency requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCommitments = async () => {
    try {
      const { data } = await axios.post('/api/emergency-donor/donor/committed', { userId: user._id });
      setMyCommitments(data);
    } catch (error) {
      toast.error('Failed to load commitments');
    }
  };

  const expressInterest = async (requestId) => {
    try {
      await axios.post('/api/emergency-donor/donor/interest', {
        donorId: user._id,
        requestId
      });
      toast.success('Interest expressed!');
      fetchNearbyRequests();
      fetchMyCommitments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error expressing interest');
    }
  };

  const withdrawInterest = async (interestId) => {
    try {
      await axios.delete(`/api/emergency-donor/donor/interest/${interestId}`, {
        data: { donorId: user._id }
      });
      toast.success('Interest withdrawn');
      fetchNearbyRequests();
      fetchMyCommitments();
    } catch (error) {
      toast.error('Error withdrawing interest');
    }
  };

  const isInterested = (requestId) =>
    myCommitments.find((c) => c.requestId === requestId)?.interestId;

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold text-red-500 mb-6">Nearby Emergency Requests</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white text-black rounded shadow-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="py-2 px-4">Patient</th>
                <th className="py-2 px-4">Blood Group</th>
                <th className="py-2 px-4">Location</th>
                <th className="py-2 px-4">Urgency</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id} className="border-b">
                  <td className="py-2 px-4">{req.patientName}</td>
                  <td className="py-2 px-4">{req.bloodGroup}</td>
                  <td className="py-2 px-4">{req.address?.city || 'N/A'}</td>
                  <td className="py-2 px-4">{req.urgency}</td>
                  <td className="py-2 px-4">{req.quantity} units</td>
                  <td className="py-2 px-4">
                    {isInterested(req._id) ? (
                      <button
                        onClick={() => withdrawInterest(isInterested(req._id))}
                        className="bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded"
                      >
                        Withdraw
                      </button>
                    ) : (
                      <button
                        onClick={() => expressInterest(req._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Volunteer
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No emergency requests in your area.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Committed section */}
      <h2 className="text-2xl font-semibold mt-10 mb-4 text-red-400">Your Commitments</h2>
      <div className="bg-white text-black rounded shadow-lg p-4">
        {myCommitments.length === 0 ? (
          <p className="text-gray-500">No active commitments.</p>
        ) : (
          <ul className="list-disc pl-6">
            {myCommitments.map((item) => (
              <li key={item.interestId}>
                <strong>{item.bloodGroup}</strong> — {item.city} —{' '}
                <span className="text-green-700">{item.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DonorEmergencyRequestPage;
