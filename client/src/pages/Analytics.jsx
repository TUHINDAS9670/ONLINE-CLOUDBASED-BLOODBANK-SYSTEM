import React, { useState, useEffect } from "react";
import Navbar from "../components/shared/layout/Navbar";
import API from "../services/API";
import moment from "moment";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const colors = [
    "#95ef0d", "#b691e6", "#FF0060", "#4F709C",
    "#1aaad4", "#0079FF", "#ef8e43", "#22A699",
  ];

  const getBloodGroupData = async () => {
    try {
      const { data } = await API.get("/analytics/bloodGroups-data");
      if (data?.success) {
        setData(data?.bloodGroupData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");
      if (data?.success) {
        setInventoryData(data?.inventory);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBloodGroupData();
    getBloodRecords();
  }, []);

  return (
    <>
      <Navbar />
      <div className="mt-[120px] lg:ml-[90px] p-4 lg:p-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.map((record, i) => (
            <div
              key={i}
              className="rounded-2xl p-4 shadow-lg backdrop-blur-md bg-opacity-70 text-white transition-transform hover:scale-105"
              style={{ backgroundColor: colors[i] }}
            >
              <div className="text-center bg-white text-black font-bold rounded-md py-2 mb-4 shadow-md">
                <h1 className="text-xl">{record.bloodGroup}</h1>
              </div>
              <p className="mb-1">Total In: <span className="font-semibold">{record.totalIn}</span> (ML)</p>
              <p className="mb-1">Total Out: <span className="font-semibold">{record.totalOut}</span> (ML)</p>
              <div className="bg-[#1d2835] text-red-500 text-center mt-4 py-2 rounded-lg shadow-inner">
                Total Available: <span className="font-bold text-xl">{record.availableBlood}</span> <span className="text-xl">(ML)</span>
              </div>
            </div>
          ))}
        </div>

        <div className="container mx-auto my-12 px-2 sm:px-4">
          <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
            Recent Blood Transactions
          </h1>
          <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200">
            <table className="min-w-full bg-white backdrop-blur">
              <thead className="bg-gradient-to-r from-red-100 via-pink-100 to-white text-gray-800">
                <tr className="text-sm sm:text-base">
                  <th className="px-4 py-3 text-left border">Blood Group</th>
                  <th className="px-4 py-3 text-left border">Inventory Type</th>
                  <th className="px-4 py-3 text-left border">Quantity</th>
                  <th className="px-4 py-3 text-left border">Donor Email</th>
                  <th className="px-4 py-3 text-left border">Time & Date</th>
                </tr>
              </thead>
              <tbody>
                {inventoryData?.map((record) => (
                  <tr key={record._id} className="hover:bg-red-50 transition duration-200">
                    <td className="px-4 py-2 border">{record.bloodGroup}</td>
                    <td className="px-4 py-2 border">{record.inventoryType}</td>
                    <td className="px-4 py-2 border">{record.quantity} (ML)</td>
                    <td className="px-4 py-2 border">{record.email}</td>
                    <td className="px-4 py-2 border">
                      {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
