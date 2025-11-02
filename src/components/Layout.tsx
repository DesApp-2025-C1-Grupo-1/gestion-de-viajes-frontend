import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Box } from "@mui/material";

interface LayoutProps {
    className?: string;
}

export default function Layout({className }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar isVisible={sidebarOpen} setIsVisible={setSidebarOpen} />

        {sidebarOpen && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 30,
              display: { lg: "none" },
            }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={`flex flex-col flex-1 px-6 py-4 overflow-y-auto ${className}`}>
          <Outlet context={{ toggleSidebar: () => setSidebarOpen(true) }}/>
        </main>
    </div>
  );
}