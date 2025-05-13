import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/layout/Layout";
import { IoMdAdd } from "react-icons/io";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from "moment";
import { toast } from "react-toastify";

const HomePageUserBased = () => {
  const { loading, error, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Handle user redirection based on role
  useEffect(() => {
    if (user?.role === "Admin") navigate("/admin/adminHome");
    else if (user?.role === "Donor") navigate("/donation-request");
    else if (user?.role === "Hospital") navigate("/organisation");
  }, [user, navigate]);

  const getBloodRecords = async () => {
    try {
      const response = await API.get("/inventory/get-inventory");
      if (response?.data?.success) {
        setData(response.data.inventory);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    getBloodRecords();
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <Layout>
      {user?.role === "Organisation" && (
        <>
          {loading ? (
            <Spinner />
          ) : (
            <div className="mt-[100px] ">
              <h1
                className="ml-4 cursor-pointer flex items-center space-x-2"
                onClick={handleOpenModal}
              >
                <IoMdAdd className="mt-1 mr-3" />
                <span className="mr-3 text-green-500">Add</span> Inventory
              </h1>
              <table className="min-w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Blood Group</th>
                    <th className="px-4 py-2 border-b text-left">Inventory Type</th>
                    <th className="px-4 py-2 border-b text-left">Quantity</th>
                    <th className="px-4 py-2 border-b text-left">Donor Email</th>
                    <th className="px-4 py-2 border-b text-left">Time & Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{record.bloodGroup}</td>
                      <td className="px-4 py-2 border-b">{record.inventoryType}</td>
                      <td className="px-4 py-2 border-b">{record.quantity} (ML)</td>
                      <td className="px-4 py-2 border-b">{record.email}</td>
                      <td className="px-4 py-2 border-b">
                        {moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Modal Component */}
              <Modal isOpen={isModalOpen} onClose={handleCloseModal}></Modal>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default  HomePageUserBased;
