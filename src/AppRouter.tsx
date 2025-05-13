import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TypeVehicle from "./pages/TypeVehicle";
//import VehiclePage from "./pages/VehiclePage";
import DriverCreate from "./pages/driver/driverCreate"; //para probar
import DriverPage from "./pages/driver/driverPage";
import Layout from "./components/Layout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/type-vehicle' element={<TypeVehicle />} />
        {/*<Route path="/vehicles" element={<VehiclePage />} />*/}
        <Route path='/drivers' element={<DriverPage />} />
        <Route path='/driver-create' element={<DriverCreate />} />
      </Route>
    </Routes>
  );
}