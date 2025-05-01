import React, { useEffect, useState } from 'react'
import Layout from '../../components/shared/layout/Layout';
import API from '../../services/API';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Consumer = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find donor records
  const getDonors = async () => {
    try {
      const { data } = await API.post("/inventory/get-inventory-hospital", {
        filters: {
          inventoryType: "out", 
          hospital: user?._id,
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
    getDonors();
  }, []);

  return (
    <Layout>
    <div className='mt-[100px] '>
   
      <table className="min-w-full table-auto border-collapse">
                   <thead className="bg-gray-100">
                     <tr>
                       {/* <th className="px-4 py-2 border-b text-left">Consumer Name</th>
                       <th className="px-4 py-2 border-b text-left">Email</th> */}
                       <th className="px-4 py-2 border-b text-left">Blood Group</th> 
                       <th className="px-4 py-2 border-b text-left">Blood Quantity</th> 
                       <th className="px-4 py-2 border-b text-left">Inventory Type</th> 
                      
                       <th className="px-4 py-2 border-b text-left">Phone</th>
                       <th className="px-4 py-2 border-b text-left">Address</th>
                       <th className="px-4 py-2 border-b text-left">Time & Date</th>
                     </tr>
                   </thead>
                   <tbody>
                   
                     {data?.map((record) => (
                       <tr key={record._id} className="hover:bg-gray-50">
                         {/* <td className="px-4 py-2 border-b">{record.hospital.hospitalName || record.organisation.organisationName+"(ORG)"}</td>
                         <td className="px-4 py-2 border-b">{record.email}</td> */}
                         
                         <td className="px-4 py-2 border-b">
                           {record.bloodGroup}
                         </td>
                         <td className="px-4 py-2 border-b">
                           {record.quantity}
                         </td>
                         <td className="px-4 py-2 border-b">
                           {record.inventoryType}
                         </td>
                         <td className="px-4 py-2 border-b">
                           {record.hospital.phoneNumber}
                         </td>
                         <td className="px-4 py-2 border-b">
                           {record.hospital.location}
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
  )
}

export default Consumer