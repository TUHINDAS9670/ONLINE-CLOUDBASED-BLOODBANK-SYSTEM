import { Routes, Route } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/Routes/protectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";
import Donor from "./pages/dashboard/Donor";
import Hospital from "./pages/dashboard/Hospital";
import Organisation from "./pages/dashboard/Organisation";
import Consumer from "./pages/dashboard/Consumer";
import DonationHistory from "./pages/dashboard/DonationHistory";
import Analytics from "./pages/Analytics";
import DonorList from "../src/pages/admin/DonorList";
import HospitalList from "../src/pages/admin/HospitalList";
import OrganisationList from "../src/pages/admin/OrganisationList";
import AdminHomePage from "./pages/admin/AdminHomePage";

import DonationRequestPage from "./pages/dashboard/DonationRequestPage";
import DonorDashboard from "./pages/dashboard/DonorDashboard";
import OrganisationRequestsPage from "./pages/dashboard/OrganisationRequestsPage";
import HomePageUserBased from "./pages/HomePageUserBased";
import HomePage from "./pages/HomePage";
import NearbyHospitals from "./pages/NoUser/NearbyHospitalAndBloodbanks";

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
                < HomePageUserBased />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor"
            element={
              <ProtectedRoute>
                <Donor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donation-list"
            element={
              <ProtectedRoute>
                <DonationHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital"
            element={
              <ProtectedRoute>
                <Hospital />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consumer"
            element={
              <ProtectedRoute>
                <Consumer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organisation"
            element={
              <ProtectedRoute>
                <Organisation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-list"
            element={
              <ProtectedRoute>
                <DonorList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital-list"
            element={
              <ProtectedRoute>
                <HospitalList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/org-list"
            element={
              <ProtectedRoute>
                <OrganisationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organisation/donation-requests"
            element={
              <ProtectedRoute>
                <OrganisationRequestsPage />
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
          <Route
            path="/homepage"
            element={
              <PublicRoute>
                <HomePage/>
              </PublicRoute>
            }
          />

          <Route
            path="/donation-request"
            element={
              <ProtectedRoute>
                <DonationRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/adminHome"
            element={
              <ProtectedRoute>
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-dashboard"
            element={
              <ProtectedRoute>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nearby-hospitals"
            element={
              <PublicRoute>
                <NearbyHospitals/>
              </PublicRoute>
            }
          />
         

        </Routes>
      </div>
    </>
  );
}

export default App;
