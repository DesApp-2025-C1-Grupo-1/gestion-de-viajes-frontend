import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/vehicle/TypeVehicle";
import VehiclePage from "./pages/vehicle/VehiclePage";
import Layout from "./components/Layout";
import VehicleForm from "./pages/vehicle/VehicleForm";
import CompanyPage from "./pages/company/CompanyPage";
import CompanyFormPage from "./pages/company/companyForm";
import DepositPage from "./pages/deposit/DepositPage";
import DepositFormPage from "./pages/deposit/DepositForm";
import DriverPage from "./pages/driver/driverPage";
import DriverFormPage from "./pages/driver/DriverForm";
import TripPage from "./pages/trip/TripPage";
import TripFormPage from "./pages/trip/TripForm";

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
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/company/create" element={<CompanyFormPage />} />
        <Route path="/companies/edit/:id" element={<CompanyFormPage />} />
        <Route path="/depots" element={<DepositPage />} />
        <Route path="/depots/form" element={<DepositFormPage />} />
        <Route path="/depots/edit/:id" element={<DepositFormPage />} />
        <Route path="/trips" element={<TripPage />} />
        <Route path="/trips/form" element={<TripFormPage />} />
        <Route path="/trips/edit/:id" element={<TripFormPage />} />
      </Route>
    </Routes>
  );
}
