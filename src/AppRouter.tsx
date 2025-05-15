import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DriverCreateEdit from "./pages/driver/driverCreateEdit"; 
import DriverPage from "./pages/driver/driverPage";
import Layout from "./components/Layout";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Dashboard />} />
        <Route path='/drivers' element={<DriverPage />} />
        <Route path='/driver/create' element={<DriverCreateEdit />} />
        <Route path="/drivers/edit/:id" element={<DriverCreateEdit />} />
      </Route>
    </Routes>
  );
}