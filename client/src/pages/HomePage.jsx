import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Spinner from "../components/shared/Spinner";
import Layout from "../components/shared/layout/Layout";
import { IoMdAdd } from "react-icons/io";
import Modal from "../components/shared/modal/Modal";
import API from "../services/API";
import moment from"moment"

const HomePage = () => {
  const { loading, error } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const getBloodRecords = async () => {
    try {
      const { data } = await API.get("/inventory/get-inventory");
      if (data?.success) {
        setData(data?.inventory);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
      
    }
  };
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  }, [error]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true); // Function to open modal
  const handleCloseModal = () => setIsModalOpen(false); // Function to close modal

  useEffect(() => {
    getBloodRecords();
  }, []);
  return (
    <Layout>
      <>
        {loading ? (
          <Spinner />
        ) : (
          <div className="mt-[100px] ">
            <h1
              className="ml-4 cursor-pointer flex items-center space-x-2"
              onClick={handleOpenModal} // Open modal on click
            >
              <IoMdAdd className="mt-1 mr-3" />
              <span className="mr-3 text-green-500">Add</span> Inventory
            </h1>
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border-b text-left">Blood Group</th>
                  <th className="px-4 py-2 border-b text-left">
                    Inventory Type
                  </th>
                  <th className="px-4 py-2 border-b text-left">Quantity</th>
                  <th className="px-4 py-2 border-b text-left">Donar Email</th>
                  <th className="px-4 py-2 border-b text-left">Time & Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{record.bloodGroup}</td>
                    <td className="px-4 py-2 border-b">
                      {record.inventoryType}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {record.quantity} (ML)
                    </td>
                    <td className="px-4 py-2 border-b">{record.donorEmail}</td>
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
    </Layout>
  );
};

export default HomePage;
