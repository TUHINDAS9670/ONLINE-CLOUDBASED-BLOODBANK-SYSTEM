import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Login } from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <div>
        <ToastContainer/>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
