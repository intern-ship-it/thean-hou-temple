// src/components/layout/MainLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main content area */}
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}
        `}
      >
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page content */}
        <main className="mt-16 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Thean Hou Temple. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
