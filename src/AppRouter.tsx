import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/vehicle/TypeVehicle";
import VehiclePage from "./pages/vehicle/VehiclePage";
import DriverCreateEdit from "./pages/driver/driverCreateEdit"; 
import DriverPage from "./pages/driver/driverPage";
import Layout from "./components/Layout";
import VehicleForm from "./pages/vehicle/VehicleForm";
import CompanyPage from "./pages/company/CompanyPage";
import CompanyCreateEdit from "./pages/company/CompanyCreateEdit";


export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/type-vehicle' element={<TypeVehicle />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/vehicles/form" element={<VehicleForm />} />
        <Route path="/vehicles/edit/:id" element={<VehicleForm />} />
        <Route path='/drivers' element={<DriverPage />} />
        <Route path='/driver/create' element={<DriverCreateEdit />} />
        <Route path="/drivers/edit/:id" element={<DriverCreateEdit />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/company/create" element={<CompanyCreateEdit />} />
        <Route path="/companies/edit/:id" element={<CompanyCreateEdit />} />
      </Route>
    </Routes>
  );
}