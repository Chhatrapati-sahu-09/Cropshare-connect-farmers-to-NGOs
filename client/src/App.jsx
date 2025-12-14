import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import socket from "./services/socket.js";

// --- Providers (Context) ---
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";

// --- Layouts ---
import Layout from "./components/Layout.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";

// --- Route Protection ---
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

// --- Public Pages ---
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import BrowseCrops from "./pages/BrowseCrops.jsx";
import CropDetailPage from "./pages/CropDetailPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import AboutPage from "./pages/AboutPage.jsx"; // ✅ Import AboutPage

// --- Dashboard Pages ---
import DashboardHome from "./pages/DashboardHome.jsx";
import AddCropPage from "./pages/AddCropPage.jsx";
import MyListingsPage from "./pages/MyListingsPage.jsx";
import BuyerRequestsPage from "./pages/BuyerRequestsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import MessagesList from "./pages/MessagesList.jsx";
import MyRequestsPage from "./pages/MyRequestsPage.jsx";
import NGOProfilePage from "./pages/NGOProfilePage.jsx";
import DonatePage from "./pages/DonatePage.jsx";

function App() {
  // Connect socket on initial app load
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      {/* AuthProvider wraps everything so all components know if you're logged in */}
      <AuthProvider>
        {/* NotificationProvider wraps everything to provide badge counts */}
        <NotificationProvider>
          <Routes>
            {/* --- Public Routes (Wrapped in Main Layout) --- */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/browse" element={<BrowseCrops />} />
              <Route path="/crop/:id" element={<CropDetailPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/about" element={<AboutPage />} />{" "}
              {/* ✅ Add About Route */}
            </Route>

            {/* --- Protected Dashboard Routes --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="add-crop" element={<AddCropPage />} />
                <Route path="my-listings" element={<MyListingsPage />} />
                <Route path="requests" element={<BuyerRequestsPage />} />
                <Route path="my-requests" element={<MyRequestsPage />} />
                <Route path="ngo-profile" element={<NGOProfilePage />} />
                <Route path="donate" element={<DonatePage />} />
                <Route path="messages" element={<MessagesList />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="chat/:receiverId" element={<ChatPage />} />
              </Route>
            </Route>
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
