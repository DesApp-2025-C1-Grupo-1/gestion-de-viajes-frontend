import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/vehicle/TypeVehicle";
import VehiclePage from "./pages/vehicle/VehiclePage";
import Layout from "./components/Layout";
import VehicleForm from "./pages/vehicle/VehicleForm";
import DepositPage from "./pages/deposit/DepositPage";
import DepositFormPage from "./pages/deposit/DepositForm";
import DriverPage from "./pages/driver/DriverPage";
import DriverFormPage from "./pages/driver/DriverForm";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/type-vehicle' element={<TypeVehicle />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/vehicles/form" element={<VehicleForm />} />
        <Route path="/vehicles/edit/:id" element={<VehicleForm />} />
        
        <Route path="/drivers" element={<DriverPage />} />
        <Route path="/driver/create" element={<DriverFormPage />} />
        <Route path="/drivers/edit/:id" element={<DriverFormPage />} />

        <Route path="/depots" element={<DepositPage />} />
        <Route path="/depots/form" element={<DepositFormPage />} />
        <Route path="/depots/edit/:id" element={<DepositFormPage />} />
      </Route>
    </Routes>
  );
}
