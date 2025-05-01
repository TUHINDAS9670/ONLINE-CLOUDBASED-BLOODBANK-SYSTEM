import React, { useState,useEffect } from 'react'

import Navbar from '../components/shared/layout/Navbar'
import API from '../services/API'
import moment from 'moment'

const Analytics = () => {
  const [data,setData]=useState([])
  const [inventoryData, setInventoryData] = useState([]);
  const colors = [
    "#95ef0d",
    "#b691e6",
    "#FF0060",
    "#4F709C",
    "#1aaad4",
    "#0079FF",
    "#ef8e43",
    "#22A699",
  ];
  //GET BLOOD GROUP DATA
  const getBloodGroupData=async ()=>{
    try {
      const {data}=await API.get('/analytics/bloodGroups-data')
      if(data?.success){
        setData(data?.bloodGroupData)
        console.log(data)
      }
    } catch (error) {
      console.log(error)

    }
  }
  //lifecycle method
  useEffect(()=>{
    getBloodGroupData();
  },[]);
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-recent-inventory");
      if (data?.success) {
        setInventoryData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      
    }
  };
  useEffect(()=>{
    getBloodRecords();
  },[]);
  return (
    <>
<Navbar />
<div className='mt-[120px] lg:ml-[90px] p-12'>
<div className="flex flex-wrap gap-4">
  {data?.map((record, i) => (
    <div
      key={i}
      className="w-72 rounded-lg shadow-md p-4"
      style={{ backgroundColor: `${colors[i]}` }}
    >
      <div className="text-center bg-white text-black rounded-md py-2 mb-4">
        <h1 className="text-xl font-bold">{record.bloodGroup}</h1>
      </div>
      <p className="text-white mb-1">
        Total In: <span className="font-semibold">{record.totalIn}</span> (ML)
      </p>
      <p className="text-white mb-1">
        Total Out: <span className="font-semibold">{record.totalOut}</span> (ML)
      </p>
      <div className="bg-[#1d2835] text-red-500 text-center mt-4 py-2 rounded-md">
        Total Available: <span className="font-bold text-xl">{record.availableBlood}</span> <span className='text-xl'>(ML)</span>
      </div>
    </div>
  ))}
</div>

<div className="container mx-auto my-8 px-4">
  <h1 className="text-2xl font-bold mb-4">Recent Blood Transactions</h1>
  <div className="overflow-x-auto">
    <table className="min-w-full border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left border">Blood Group</th>
          <th className="px-4 py-2 text-left border">Inventory Type</th>
          <th className="px-4 py-2 text-left border">Quantity</th>
          <th className="px-4 py-2 text-left border">Donor Email</th>
          <th className="px-4 py-2 text-left border">Time & Date</th>
        </tr>
      </thead>
      <tbody>
        {inventoryData?.map((record) => (
          <tr key={record._id} className="hover:bg-gray-50">
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
  )
}

export default Analytics