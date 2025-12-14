import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { initializeLanguage } from "./utils/translate.js";

// Initialize saved language preference
initializeLanguage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);
