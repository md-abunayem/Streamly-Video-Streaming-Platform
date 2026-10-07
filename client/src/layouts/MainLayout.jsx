import React, { useState } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="w-full">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          closeSidebar={closeSidebar}
        ></Sidebar>
      </div>
      <main className="min-h-screen bg-[var(--page)] pt-24 text-[var(--text-primary)] sm:pt-14 md:pt-16">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
