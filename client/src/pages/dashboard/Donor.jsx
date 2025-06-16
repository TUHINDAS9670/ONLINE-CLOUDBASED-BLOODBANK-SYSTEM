import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Donor = () => {
  const [data, setData] = new useState([]);
  const [bloodGroupFilter, setBloodGroupFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  //find donor records
  const getDonors = async () => {
    try {
      const { data } = await API.get("/inventory/get-donors");
      console.log(data);
      if (data?.success) {
        setData(data?.donors);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const clearFilter=()=>{
 setBloodGroupFilter("");
 setCityFilter("")
}
  useEffect(() => {
    getDonors();
  }, []);
  return (
    <Layout>
      <div className="mt-[100px] ">
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            className="border px-4 py-2 rounded"
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
            ))}
          </select>

          <select
            className="border px-4 py-2 rounded"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {[
              ...new Set(
                data.map((item) => item.location?.city).filter(Boolean)
              ),
            ].map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        <button className="p-3 text-lg text-white bg-red-500" onClick={clearFilter}>Clear Filters</button>
        </div>

        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-left">Donor Name</th>
              <th className="px-4 py-2 border-b text-left">Email</th>
              <th className="px-4 py-2 border-b text-left">Blood Group</th>

              <th className="px-4 py-2 border-b text-left">Phone</th>
              <th className="px-4 py-2 border-b text-left">Address</th>
              <th className="px-4 py-2 border-b text-left">Time & Date</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((record) => {
                const matchesBlood =
                  bloodGroupFilter === "" ||
                  record.bloodGroup === bloodGroupFilter;
                const matchesCity =
                  cityFilter === "" || record.location?.city === cityFilter;
                return matchesBlood && matchesCity;
              })
              .map((record) => (
                // your <tr>...

                <tr key={record._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">
                    {record.name || record.organisationName + "(ORG)"}
                  </td>
                  <td className="px-4 py-2 border-b">{record.email}</td>

                  <td className="px-4 py-2 border-b">{record.bloodGroup}</td>
                  <td className="px-4 py-2 border-b">{record.phoneNumber}</td>
                  <td className="px-4 py-2 border-b">
                    {record.location?.full}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default Donor;
