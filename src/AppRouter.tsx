import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/vehicle/TypeVehicle";
import VehiclePage from "./pages/vehicle/VehiclePage";
import Layout from "./components/Layout";
import VehicleForm from "./pages/vehicle/VehicleForm";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/type-vehicle' element={<TypeVehicle />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/vehicles/form" element={<VehicleForm />} />
        <Route path="/vehicles/form/:id" element={<VehicleForm />} />
      </Route>
    </Routes>
  );
}