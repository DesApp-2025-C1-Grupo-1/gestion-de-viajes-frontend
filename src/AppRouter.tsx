import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/TypeVehicle";
import VehiclePage from "./pages/VehiclePage";

export function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/type-vehicle' element={<TypeVehicle />} />
      <Route path="/vehicles" element={<VehiclePage />} />
    </Routes>
  );
}