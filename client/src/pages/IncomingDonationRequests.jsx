import React, { useEffect, useState } from 'react';
import Layout from '../../components/shared/layout/Layout';
import axios from 'axios';

const IncomingDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/donations/incoming-requests');
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to load incoming requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/donations/request/${id}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Incoming Donation Requests</h1>
        {loading ? (
          <p>Loading...</p>
        ) : requests.length === 0 ? (
          <p>No donation requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Donor</th>
                  <th className="py-2 px-4 text-left">Blood Group</th>
                  <th className="py-2 px-4 text-left">Quantity (ml)</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{req.donor?.name || 'N/A'}</td>
                    <td className="py-2 px-4">{req.bloodGroup}</td>
                    <td className="py-2 px-4">{req.quantity}</td>
                    <td className="py-2 px-4 capitalize">{req.status}</td>
                    <td className="py-2 px-4">
                      {req.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'approved')}
                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-600">{req.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IncomingDonationRequests;