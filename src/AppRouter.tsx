import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/TypeVehicle";

export function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />} />
      <Route path='/type-vehicle' element={<TypeVehicle />} />
    </Routes>
  );
}