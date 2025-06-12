// import React, { useEffect, useState } from "react";
// import Layout from "../../components/shared/layout/Layout";
// import API from "../../services/API";
// import { useSelector } from "react-redux";
// import { toast } from "react-toastify";

// const HospitalBloodRequestPage = () => {
//   const { user } = useSelector((state) => state.auth);
//   const [organisations, setOrganisations] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [formData, setFormData] = useState({
//     bloodGroup: "",
//     quantity: "",
//     organisationId: "",
//     comment: "",
//   });

//   const fetchOrganisations = async () => {
//     try {
//       const res = await API.get("/admin/org-list");
//       if (res.data.success) setOrganisations(res.data.orgData);
//     } catch (error) {
//       toast.error("Failed to load organisations");
//     }
//   };

//   const fetchRequests = async () => {
//     try {
//       const res = await API.get("/hospital-blood-requests/my-requests");
//       console.log(res.data)
// setRequests(res.data.data);
//     } catch (error) {
//       toast.error("Error fetching requests");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/hospital-blood-requests/request", {
//         ...formData,
//         email: user.email,
//         name: user.name,
//       });
//       toast.success("Request submitted");
//       setFormData({
//         bloodGroup: "",
//         quantity: "",
//         organisationId: "",
//         comment: "",
//       });
//       fetchRequests();
//     } catch (error) {
//       toast.error("Error sending request");
//     }
//   };

//   const handleEdit = async (req) => {
//     const quantity = prompt("Update Quantity", req.quantity);
//     const comment = prompt("Update Comment", req.comment || "");

//     if (!quantity) return;

//     try {
//       await API.put(`/hospital-blood-requests/request/${req._id}`, {
//         quantity,
//         comment,
//         organisationId: req.organisation?._id,
//       });
//       fetchRequests();
//     } catch (error) {
//       toast.error("Failed to update request.");
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this request?")) return;
//     try {
//       await API.delete(`/hospital-blood-requests/request/${id}`);
//       fetchRequests();
//     } catch (error) {
//       toast.error("Failed to delete request.");
//     }
//   };

//   useEffect(() => {
//     fetchOrganisations();
//     fetchRequests();
//   }, []);

//   if (!user) return <div>Loading...</div>;

//   return (
//     <Layout>
//       <div className="p-4 mt-20">
//         <h1 className="text-xl font-bold mb-4">Request Blood from Organisation</h1>
//         <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
//           <input type="text" value={user.name || ""} disabled className="border p-2 rounded" />
//           <input type="email" value={user.email || ""} disabled className="border p-2 rounded" />

//           <select
//             value={formData.bloodGroup}
//             onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
//             className="border p-2 rounded"
//             required
//           >
//             <option value="">Select Blood Group</option>
//             {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
//               <option key={bg} value={bg}>{bg}</option>
//             ))}
//           </select>

//           <input
//             type="number"
//             placeholder="Quantity (ml)"
//             value={formData.quantity}
//             onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
//             className="border p-2 rounded"
//             required
//           />

//           <select
//             value={formData.organisationId}
//             onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
//             className="border p-2 rounded"
//             required
//           >
//             <option value="">Select Organisation</option>
//             {organisations.map((org) => (
//               <option key={org._id} value={org._id}>{org.organisationName || org.name}</option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Comment / Urgency (optional)"
//             value={formData.comment}
//             onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
//             className="border p-2 rounded col-span-2"
//           />

//           <button type="submit" className="bg-blue-500 text-white p-2 rounded col-span-2">
//             Submit Request
//           </button>
//         </form>

//         <div className="mt-8">
//           <h2 className="font-semibold mb-2">Your Requests</h2>
//           <table className="min-w-full border table-auto">
//             <thead>
//               <tr className="bg-gray-100 text-left">
//                 <th className="p-2 border">Blood Group</th>
//                 <th className="p-2 border">Quantity</th>
//                 <th className="p-2 border">Organisation</th>
//                 <th className="p-2 border">Comment</th>
//                 <th className="p-2 border">Status</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req) => (
//                 <tr key={req._id}>
//                   <td className="p-2 border">{req.bloodGroup}</td>
//                   <td className="p-2 border">{req.quantity} ml</td>
//                   <td className="p-2 border">{req.organisation?.organisationName || "N/A"}</td>
//                   <td className="p-2 border">{req.comment || "N/A"}</td>
//                   <td className="p-2 border">{req.status}</td>
//                   <td className="p-2 border">
//                     {req.status === "pending" && (
//                       <div className="flex gap-2">
//                         <button
//                           className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
//                           onClick={() => handleEdit(req)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="bg-red-600 text-white px-2 py-1 rounded text-sm"
//                           onClick={() => handleDelete(req._id)}
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default HospitalBloodRequestPage;

import React, { useEffect, useState } from "react";
import Layout from "../../components/shared/layout/Layout";
import API from "../../services/API";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const HospitalBloodRequestPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [organisations, setOrganisations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [formData, setFormData] = useState({
    reason: "",
    organisationId: "",
    quantity: "",
    bloodGroup: "",
  });

  useEffect(() => {
    if (user) {
      fetchOrganisations();
      fetchRequests();
    }
  }, [user]);

  const fetchOrganisations = async () => {
    try {
      const res = await API.get("/admin/org-list");
      if (res.data.success) {
        setOrganisations(res.data.orgData);
      } else {
        toast.error("Failed to load organisations");
      }
    } catch (error) {
      toast.error("Failed to load organisations");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.post("/hospital-requests/my-requests");
      setRequests(res.data);
      console.log(user)
    } catch (error) {
      toast.error("Error fetching requests");
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  const { reason, organisationId, quantity, bloodGroup } = formData;

  if (!reason || !quantity || !organisationId || !bloodGroup) {
    toast.error("All fields are required");
    return;
  }

  try {
await API.post("/hospital-requests/request", {
  reason,
  organisationId,
  quantity,
  bloodGroup,
  hospitalName: user.hospitalName, 
});

    toast.success("Request submitted");
    setFormData({ reason: "", organisationId: "", quantity: "", bloodGroup: "" });
    fetchRequests();
  } catch (error) {
    toast.error("Error sending request");
  }
};


  const handleEdit = async (req) => {
    const quantity = prompt("Update Quantity", req.quantity);
    const reason = prompt("Update Reason", req.reason || "");

    if (!quantity || !reason) return;

    try {
      await API.put(`/hospital-requests/request/${req._id}`, {
        quantity,
        reason,
        organisationId: req.organisation?._id,
      });
      fetchRequests();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?"))
      return;

    try {
      await API.delete(`/hospital-requests/request/${id}`);
      toast.success("Request deleted");
      fetchRequests();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete request");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="p-4 mt-20">
        <h1 className="text-xl font-bold mb-4">Request Blood</h1>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow"
        >
          <input
            type="text"
            value={user.hospitalName || ""}
            disabled
            className="border p-2 rounded"
          />
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Reason for Request"
            value={formData.reason}
            onChange={(e) =>
              setFormData({ ...formData, reason: e.target.value })
            }
            className="border p-2 rounded"
          />

          <select
            value={formData.organisationId}
            onChange={(e) =>
              setFormData({ ...formData, organisationId: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select Organisation</option>
            {organisations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.organisationName || org.name}
              </option>
            ))}
          </select>
          <select
            value={formData.bloodGroup || ""}
            onChange={(e) =>
              setFormData({ ...formData, bloodGroup: e.target.value })
            }
            className="border p-2 rounded"
            required
          >
            <option value="">Select Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <input
            type="number"
            placeholder="Quantity (ml)"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded col-span-2"
          >
            Submit Request
          </button>
        </form>

        <div className="mt-8">
          <h2 className="font-semibold mb-2">Your Requests</h2>
          <table className="min-w-full border table-auto">
          <thead>
  <tr className="bg-gray-100 text-left">
    <th className="p-2 border">Quantity</th>
    <th className="p-2 border">Blood Group</th>
    <th className="p-2 border">Organisation</th>
    <th className="p-2 border">Reason</th>
    <th className="p-2 border">Status</th>
    <th className="p-2 border">Actions</th>
  </tr>
</thead>
<tbody>
  {requests.map((req) => (
    <tr key={req._id}>
      <td className="p-2 border">{req.quantity} ml</td>
      <td className="p-2 border">{req.bloodGroup}</td>
      <td className="p-2 border">
        {req.organisation?.organisationName || "N/A"}
      </td>
      <td className="p-2 border">{req.reason || "N/A"}</td>
      <td className="p-2 border">{req.status}</td>
      <td className="p-2 border">
        {req.status === "pending" && (
          <div className="flex gap-2">
            <button
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleEdit(req)}
            >
              Edit
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleDelete(req._id)}
            >
              Delete
            </button>
          </div>
        )}
        {req.status === "rejected" && (
  <p className="text-red-500 text-sm mt-1">
    Reason: {req.remarks || "No reason provided"}
  </p>
)}

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

export default HospitalBloodRequestPage;
