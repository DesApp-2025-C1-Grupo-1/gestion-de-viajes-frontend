import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
    className?: string;
}


export default function Layout({className }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar />
          <main className={`flex-1 p-4   overflow-hidden ${className}`}>
        <Outlet />
        </main>
    </div>
  );
}