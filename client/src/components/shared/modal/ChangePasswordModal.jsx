import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const ChangePasswordModal = ({ isOpen, onClose, onChangePassword }) => {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    // Call parent handler (API trigger)
    onChangePassword(form.oldPassword, form.newPassword);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" leave="ease-in duration-200"
          enterFrom="opacity-0" enterTo="opacity-100"
          leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg space-y-4">
            <Dialog.Title className="text-xl font-semibold text-red-600">Change Password</Dialog.Title>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div>
              <label className="block text-sm text-gray-700 mb-1">Old Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="oldPassword"
                className="w-full border border-red-400 rounded px-3 py-2"
                value={form.oldPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                className="w-full border border-red-400 rounded px-3 py-2"
                value={form.newPassword}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="w-full border border-red-400 rounded px-3 py-2"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} />
              <label className="text-sm text-gray-700">Show Password</label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={onClose} className="px-4 py-2 border rounded text-sm hover:bg-gray-100">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                Update Password
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChangePasswordModal;
