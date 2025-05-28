import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/vehicle/TypeVehicle";
import VehiclePage from "./pages/vehicle/VehiclePage";
import DriverCreateEdit from "./pages/driver/DriverCreateEdit"; 
import DriverPage from "./pages/driver/driverPage";
import Layout from "./components/Layout";
import VehicleForm from "./pages/vehicle/VehicleForm";
import DepositPage from "./pages/deposit/DepositPage";
import DepositFormPage from "./pages/deposit/DepositForm";
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
        <Route path='/drivers' element={<DriverPage />} />
        <Route path='/driver/create' element={<DriverCreateEdit />} />
        <Route path="/drivers/edit/:id" element={<DriverCreateEdit />} />
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