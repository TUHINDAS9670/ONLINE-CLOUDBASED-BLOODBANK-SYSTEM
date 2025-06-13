import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import { useSelector } from "react-redux";
import API from "../../services/API";
import moment from "moment";

const Organisation = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  const getOrg = async () => {
    try {
      if (user?.role === "Donor") {
        const { data } = await API.get("/inventory/get-organisations");
        if (data?.success) setData(data?.org);
      }
      if (user?.role === "Hospital") {
        const { data } = await API.get("/inventory/get-organisations-for-hospitals");
        if (data?.success) setData(data?.org);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrg();
  }, [user]);

  return (
    <Layout>
      <div className="mt-[100px] px-4 md:px-8 lg:px-16">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Registered Organisations
        </h1>
        <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 backdrop-blur-sm">
          <table className="min-w-full bg-white text-sm sm:text-base">
            <thead className="bg-gradient-to-r from-rose-100 to-white text-gray-800">
              <tr>
                <th className="px-4 py-3 text-left border-b">Organisation Name</th>
                <th className="px-4 py-3 text-left border-b">Email</th>
                <th className="px-4 py-3 text-left border-b">Phone</th>
                <th className="px-4 py-3 text-left border-b">Address</th>
                <th className="px-4 py-3 text-left border-b">Time & Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr key={record._id} className="hover:bg-gray-50 transition duration-200">
                  <td className="px-4 py-2 border-b">{record.organisationName}</td>
                  <td className="px-4 py-2 border-b">{record.email}</td>
                  <td className="px-4 py-2 border-b">{record.phoneNumber}</td>
                  <td className="px-4 py-2 border-b">{record.location?.full}</td>
                  <td className="px-4 py-2 border-b">
                    {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Organisation;
