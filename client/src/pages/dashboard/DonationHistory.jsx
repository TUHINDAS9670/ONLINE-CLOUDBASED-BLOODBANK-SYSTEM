import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/shared/layout/Layout';
import API from '../../services/API';
import { useSelector } from 'react-redux';

const DonationHistory = () => {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  //find donor records
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
    <div className='mt-[100px] '>
   
      <table className="min-w-full table-auto border-collapse">
                   <thead className="bg-gray-100">
                     <tr>
                       {/* <th className="px-4 py-2 border-b text-left">Consumer Name</th> */}
                       {/* <th className="px-4 py-2 border-b text-left">Email</th> */}
                       <th className="px-4 py-2 border-b text-left">Blood Group</th> 
                       <th className="px-4 py-2 border-b text-left">Blood Quantity</th> 
                       {/* <th className="px-4 py-2 border-b text-left">Inventory Type</th>  */}
                       <th className="px-4 py-2 border-b text-left">Organisation Name</th> 
                       <th className="px-4 py-2 border-b text-left">Organisation Address</th> 
                       <th className="px-4 py-2 border-b text-left">Organisation Email</th> 
                       <th className="px-4 py-2 border-b text-left">Organisation Phone</th> 
                      
                       {/* <th className="px-4 py-2 border-b text-left">Phone</th> */}
                       {/* <th className="px-4 py-2 border-b text-left">Address</th> */}
                       <th className="px-4 py-2 border-b text-left">Time & Date</th>
                     </tr>
                   </thead>
                   <tbody>
                   
                     {data?.map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                     <td className="px-4 py-2 border-b">{record.bloodGroup}</td>
<td className="px-4 py-2 border-b">{record.quantity}</td>
<td className="px-4 py-2 border-b">
  {record.organisation?.organisationName
    ? record.organisation.organisationName + " (ORG)"
    : record.hospital?.hospitalName + " (HOSPITAL)"}
</td>
<td className="px-4 py-2 border-b">
  {record.organisation?.location?.full ||
    record.hospital?.location?.full || "N/A"}
</td>
<td className="px-4 py-2 border-b">
  {record.organisation?.email || record.hospital?.email || "N/A"}
</td>
<td className="px-4 py-2 border-b">
  {record.organisation?.phoneNumber || record.hospital?.phoneNumber || "N/A"}
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

export default DonationHistory