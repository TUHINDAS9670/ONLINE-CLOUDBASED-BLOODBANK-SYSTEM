import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/shared/layout/Layout';
import API from '../../services/API';
import { useSelector } from 'react-redux';

const DonationHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  const getDonors = async () => {
    try {
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "in",
          donor: user?._id,
        },
      });
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getDonors();
    }
  }, [user]);

  return (
    <Layout>
      <div className="mt-[100px] p-4 animate-fade-in">
        <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-red-500 to-red-700 text-white">
              <tr>
                <th className="px-4 py-2 border-b text-left">Blood Group</th>
                <th className="px-4 py-2 border-b text-left">Blood Quantity</th>
                <th className="px-4 py-2 border-b text-left">Organisation Name</th>
                <th className="px-4 py-2 border-b text-left">Organisation Address</th>
                <th className="px-4 py-2 border-b text-left">Organisation Email</th>
                <th className="px-4 py-2 border-b text-left">Organisation Phone</th>
                <th className="px-4 py-2 border-b text-left">Time & Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-red-50 transition duration-300 ease-in-out"
                >
                  <td className="px-4 py-2 border-b">{record.bloodGroup}</td>
                  <td className="px-4 py-2 border-b">{record.quantity}</td>
                  <td className="px-4 py-2 border-b">
                    {record.organisation?.organisationName
                      ? record.organisation.organisationName + " (ORG)"
                      : record.hospital?.hospitalName + " (HOSPITAL)"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {record.organisation?.location?.full ||
                      record.hospital?.location?.full ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {record.organisation?.email ||
                      record.hospital?.email ||
                      "N/A"}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {record.organisation?.phoneNumber ||
                      record.hospital?.phoneNumber ||
                      "N/A"}
                  </td>
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

export default DonationHistory;
