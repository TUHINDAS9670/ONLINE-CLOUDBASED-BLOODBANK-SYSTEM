import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { Login } from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/Routes/protectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";

function App() {
  return (
    <>
      <div>
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
