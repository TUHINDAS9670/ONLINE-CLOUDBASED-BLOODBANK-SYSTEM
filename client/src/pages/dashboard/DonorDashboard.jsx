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
    donated: 0,
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
      <div className="p-4 mt-20 animate-fade-in">
        <h1 className="text-2xl font-bold mb-6 text-[#dc2626] tracking-wide uppercase drop-shadow-md">
          Donor Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Total", "Approved", "Rejected", "Donated"].map((label, i) => {
            const value =
              label === "Total"
                ? stats.total
                : label === "Approved"
                ? stats.approved
                : label === "Rejected"
                ? stats.rejected
                : stats.donated;

            const bgColor =
              label === "Approved"
                ? "bg-green-100 border-green-400"
                : label === "Rejected"
                ? "bg-red-100 border-red-400"
                : label === "Donated"
                ? "bg-blue-100 border-blue-400"
                : "bg-gray-100 border-gray-400";

            return (
              <div
                key={i}
                className={`relative overflow-hidden border-2 ${bgColor} p-6 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300`}
              >
                <div className="text-center">
                  <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
                  <p className="text-4xl font-bold text-[#1e293b] mt-2 animate-pulse">{value}</p>
                </div>
                <div className="absolute -bottom-6 -right-6 opacity-10 text-[8rem] font-bold text-[#dc2626] pointer-events-none select-none">
                  {label.charAt(0)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default DonorDashboard;
