import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";

const DonorDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    donated: 0
  });

  const fetchStats = async () => {
    try {
      const res = await API.get("/donations/my-stats");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="p-4 mt-20">
        <h1 className="text-2xl font-bold mb-4">Donor Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          {["Total", "Approved", "Rejected", "Donated"].map((label, i) => (
            <div key={i} className="bg-white p-4 rounded shadow text-center">
              <h2 className="text-xl font-semibold">{label}</h2>
              <p className="text-2xl mt-2">
                {label === "Total" ? stats.total : label === "Approved" ? stats.approved : label === "Rejected" ? stats.rejected : stats.donated}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DonorDashboard;
