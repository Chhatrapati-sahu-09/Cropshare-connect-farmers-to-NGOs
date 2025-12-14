import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar"; // Your new navbar
import Footer from "./Footer";
import "./Layout.css";

// 1. Import your logo file
// Make sure this path is correct!
import cropshareLogo from "../assets/cropshare-logo.png";

const Layout = () => {
  return (
    <div className="layout">
      {/* 2. Pass the logo as a prop */}
      <Navbar logo={cropshareLogo} />

      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
