import React, { useState } from "react";
import InputType from "./InputType";
import API from "../../../services/API";
import { useSelector } from "react-redux";

const Modal = ({ isOpen, onClose}) => {
  if (!isOpen) return null; // Render nothing if the modal is closed
  const { user } = useSelector((state) => state.auth);
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [donorEmail, setDonorEmail] = useState("");
  // handle modal data
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        return alert("Please Provide All Fields");
      }
      const { data } = await API.post("/inventory/create-inventory", {
        donorEmail,
        email:user?.email,
        organisation: user?._id,
        inventoryType,
        bloodGroup,
        quantity,
      });
      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h5 className="text-lg font-semibold">Manage Blood Record</h5>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4">
          <div className="flex mb-3">
            Blood Type: &nbsp;
            <div className="form-check ms-3">
              <input
                type="radio"
                name="inRadio"
                defaultChecked
                value={"in"}
                onChange={(e) => setInventoryType(e.target.value)}
                className="form-check-input"
              />
              <label htmlFor="in" className="form-check-label m-4">
                IN
              </label>
            </div>
            <div className="form-check ms-3">
              <input
                type="radio"
                name="inRadio"
                value={"out"}
                onChange={(e) => setInventoryType(e.target.value)}
                className="form-check-input"
              />
              <label htmlFor="out" className="form-check-label m-4">
                OUT
              </label>
            </div>
          </div>
          <select
            className="form-select block w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            aria-label="Default select example"
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            <option defaultValue={"Open this select menu"}>
              Open this select menu
            </option>
            <option value={"O+"}>O+</option>
            <option value={"O-"}>O-</option>
            <option value={"AB+"}>AB+</option>
            <option value={"AB-"}>AB-</option>
            <option value={"A+"}>A+</option>
            <option value={"A-"}>A-</option>
            <option value={"B+"}>B+</option>
            <option value={"B-"}>B-</option>
          </select>

          <InputType
            labelText={"Donar Email"}
            labelFor={"donarEmail"}
            inputType={"email"}
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="mt-4 block w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />

          <InputType
            labelText={"Quantity (ML)"}
            labelFor={"quantity"}
            inputType={"number"}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-4 block w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4 border-t p-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600"
            
            onClick={handleModalSubmit}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
