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
import AgendaPage from "./pages/trip/AgendaPage";
import DistributionListPage from "./pages/tripDistribution/DistributionListPage";
import DistributionFormPage from "./pages/tripDistribution/DistributionFormPage";
import DistributionDetailsPage from "./pages/tripDistribution/DistributionDetailsPage";
import DepositDetailsPage from "./pages/deposit/DepositDetailsPage";
import VehicleDetailsPage from "./pages/vehicle/VehicleDetailsPage";
import DriverDetailsPage from "./pages/driver/DriverDetailsPage";
import CompanyDetailsPage from "./pages/company/CompanyDetailsPage";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/type-vehicle' element={<TypeVehicle />} />
        <Route path="/vehicles" element={<VehiclePage />} />
        <Route path="/vehicles/form" element={<VehicleForm />} />
        <Route path="/vehicles/edit/:id" element={<VehicleForm />} />   
        <Route path="/vehicles/details/:id" element={<VehicleDetailsPage />} />   
        <Route path="/drivers" element={<DriverPage />} />
        <Route path="/driver/create" element={<DriverFormPage />} />
        <Route path="/drivers/edit/:id" element={<DriverFormPage />} />
        <Route path="/drivers/details/:id" element={<DriverDetailsPage />} />
        <Route path="/companies" element={<CompanyPage />} />
        <Route path="/company/create" element={<CompanyFormPage />} />
        <Route path="/companies/edit/:id" element={<CompanyFormPage />} />
        <Route path="/companies/details/:id" element={<CompanyDetailsPage />} />
        <Route path="/depots" element={<DepositPage />} />
        <Route path="/depots/form" element={<DepositFormPage />} />
        <Route path="/depots/edit/:id" element={<DepositFormPage />} />
        <Route path="/depots/details/:id" element={<DepositDetailsPage />} />
        <Route path="/trips/collection" element={<TripPage />} />
        <Route path="/trips/collection/form" element={<TripFormPage />} />
        <Route path="/trips/collection/edit/:id" element={<TripFormPage />} />
        <Route path="/agenda/:tipo/:id" element={<AgendaPage />} />
        <Route path="/trips/distribution" element={<DistributionListPage />} />
        <Route path="/trips/distribution/form" element={<DistributionFormPage />} />
        <Route path="/trips/distribution/edit/:id" element={<DistributionFormPage />} />
        <Route path="/trips/distribution/details/:id" element={<DistributionDetailsPage />} />
      </Route>
    </Routes>
  );
}
