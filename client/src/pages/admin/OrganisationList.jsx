import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import moment from "moment";
import API from "../../services/API";
import { RiDeleteBin6Fill } from "react-icons/ri";
const OrganisationList = () => {
  const [data,setData]=new useState([])
    //find donor records
    const getDonors=async()=>{
      try {
        const {data}=await API.get('/admin/org-list')
        console.log(data);
       if(data?.success){
        setData(data?.orgData)
       }
        
  
      } catch (error) {
        console.log(error);
        
      }
    };
    useEffect(()=>{
      
      getDonors();
    },[]);
    //DELETE FUNCTION
    const handelDelete = async (id) => {
      try {
        let answer = window.prompt(
          "Are You SUre Want To Delete This Hospital",
          "Sure"
        );
        if (!answer) return;
        const { data } = await API.delete(`/admin/delete-donor/${id}`);//here delete donor is used to delete hospital record also because we didn't create any seperate controller method for delete hospital and org we use deleteDonorController for all delete cases
        alert(data?.message);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <Layout>
      <div className='mt-[100px] '>
     
        <table className="min-w-full table-auto border-collapse">
                     <thead className="bg-gray-100">
                       <tr>
                         <th className="px-4 py-2 border-b text-left">Organisation Name</th>
                         <th className="px-4 py-2 border-b text-left">Email</th>
                         {/* <th className="px-4 py-2 border-b text-left">Blood Group</th>  */}
                        
                         <th className="px-4 py-2 border-b text-left">Phone</th>
                         <th className="px-4 py-2 border-b text-left">Address</th>
                         <th className="px-4 py-2 border-b text-left">Time & Date</th>
                         <th className="px-4 py-2 border-b text-left">Action</th>
                       </tr>
                     </thead>
                     <tbody>
                     
                       {data?.map((record) => (
                         <tr key={record._id} className="hover:bg-gray-50">
                           <td className="px-4 py-2 border-b">{ record.organisationName}</td>
                           <td className="px-4 py-2 border-b">{record.email}</td>
                           
                           {/* <td className="px-4 py-2 border-b">
                             {record.bloodGroup}
                           </td> */}
                           <td className="px-4 py-2 border-b">
                             {record.phoneNumber}
                           </td>
                           <td className="px-4 py-2 border-b">
                             {record.location?.full}
                           </td>
                           <td className="px-4 py-2 border-b">
                             {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                           </td>
                           <td className="px-4 py-2 border-b">
                             <button onClick={()=>{
                              handelDelete(record._id)
                             }} className='p-4  w-14 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-700 '><RiDeleteBin6Fill className='w-6 h-5'/>
                             </button>
                           </td>
                         
                         </tr>
                       ))}
                     </tbody>
                   </table>
      
      </div>
      </Layout>
    )
};

export default OrganisationList;
