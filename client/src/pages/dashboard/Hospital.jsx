import React, { useEffect, useState } from 'react'
import Layout from '../../components/shared/layout/Layout'
import API from '../../services/API';
import moment from 'moment';

const Hospital = () => {
    const [data,setData]=new useState([])
    //find donor records
    const getDonors=async()=>{
      try {
        const {data}=await API.get('/inventory/get-hospitals')
        console.log(data);
       if(data?.success){
        setData(data?.hospitals)
       }
        
  
      } catch (error) {
        console.log(error);
        
      }
    };
    useEffect(()=>{
      
      getDonors();
    },[]);
  return (
    <Layout>
      <div className='mt-[100px] '>
        <table className="min-w-full table-auto border-collapse">
                         <thead className="bg-gray-100">
                           <tr>
                             <th className="px-4 py-2 border-b text-left">Hospital Name</th>
                             <th className="px-4 py-2 border-b text-left">Email</th>
                             
                            
                             <th className="px-4 py-2 border-b text-left">Phone</th>
                             <th className="px-4 py-2 border-b text-left">Address</th>
                             <th className="px-4 py-2 border-b text-left">Time & Date</th>
                           </tr>
                         </thead>
                         <tbody>
                         
                           {data?.map((record) => (
                             <tr key={record._id} className="hover:bg-gray-50">
                               <td className="px-4 py-2 border-b">{record.hospitalName}</td>
                               <td className="px-4 py-2 border-b">{record.email}</td>
                               
                               
                               <td className="px-4 py-2 border-b">
                                 {record.phoneNumber}
                               </td>
                               <td className="px-4 py-2 border-b">
                                 {record.location}
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

export default Hospital