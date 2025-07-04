import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

interface LayoutProps {
    className?: string;
}


export default function Layout({className }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar isVisible={sidebarOpen} />

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className={`flex flex-col flex-1 p-4   overflow-hidden ${className}`}>
          <Outlet context={{ toggleSidebar: () => setSidebarOpen(true) }}/>
        </main>
    </div>
  );
}