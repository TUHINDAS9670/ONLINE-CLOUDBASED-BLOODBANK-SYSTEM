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
import EmergencyRequestPage from "./pages/dashboard/EmergencyRequestPage";
import HospitalBloodRequestPage from "./pages/dashboard/HospitalBloodRequestPage";
import OrganisationHospitalRequestsPage from "./pages/dashboard/OrganisationHospitalRequestPage";
import PublicInventoryDashboard from "./pages/NoUser/PublicInventoryDashboard";
import CreateAdminPage from "./pages/admin/CreateAdminPage";
import MyProfile from "./pages/dashboard/MyProfile";
import EmergencyRequestStatusView from "./pages/admin/EmergencyRequestStatusView ";
import AdminEmergencyRequests from "./pages/admin/AdminEmergencyRequests";
import OrganisationEmergencyRequests from "./pages/dashboard/OrganisationEmergencyRequests";

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
            path="/organisation/emergency-requests"
            element={
              <ProtectedRoute>
                <OrganisationEmergencyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital-blood-request"
            element={
              <ProtectedRoute>
                <HospitalBloodRequestPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organisation/organaisation-hospital-blood-requests"
            element={
              <ProtectedRoute>
                <OrganisationHospitalRequestsPage />
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
            path="/admin/emergency-requests"
            element={
              <ProtectedRoute>
                <AdminEmergencyRequests />
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
            path="/register-admin"
            element={
              <ProtectedRoute>
                <CreateAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-profile"
            element={
              <ProtectedRoute>
                <MyProfile/>
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
          <Route
            path="/public-inventory"
            element={
              <PublicRoute>
                <PublicInventoryDashboard />
              </PublicRoute>
            }
          />
          <Route
            path="/emergency/new"
            element={
              <PublicRoute>
                <EmergencyRequestPage/>
              </PublicRoute>
            }
          />
         
         

        </Routes>
      </div>
    </>
  );
}

export default App;
