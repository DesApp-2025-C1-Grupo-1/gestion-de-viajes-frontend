import { CalendarDays, ChartColumn, ClipboardList, DollarSign, Fuel, Layers, MapPin, Navigation, Package, Users } from "lucide-react";
import DriverIcon from "../components/icons/DriverIcon";
import VehicleIcon from "../components/icons/VehicleIcon";
import DepotIcon from "../components/icons/DepotIcon";
import TripIcon from "../components/icons/TripIcon";
import CompanyIcon from "../components/icons/CompanyIcon";

export const sidebarMenus = {
  viajes: [
    { src: DriverIcon, title: "Choferes", link: "drivers" },
    { src: DepotIcon, title: "Depósitos", link: "depots" },
    { src: CompanyIcon, title: "Empresas", link: "companies" },
    { src: VehicleIcon, title: "Vehículos", link: "vehicles" },
    { src: TripIcon, title: "Viajes", link: "trips/distribution" },
  ],
  remitos: [
    { src: CalendarDays, title: "Agenda", link: "https://remitos-front.netlify.app/agenda" },
    { src: Users, title: "Clientes", link: "https://remitos-front.netlify.app/clientes" },
    { src: MapPin, title: "Destinos", link: "https://remitos-front.netlify.app/destinos" },
    { src: ClipboardList, title: "Remitos", link: "https://remitos-front.netlify.app/remitos" },
    { src: ChartColumn, title: "Reportes", link: "https://remitos-front.netlify.app/reportes" },
  ],
  costos: [
    { src: Layers, title: "Adicionales", link: "https://tarifas-de-costo.netlify.app/adicionales" },
    { src: Package, title: "Cargas", link: "https://tarifas-de-costo.netlify.app/tipos-de-carga" },
    { src: Fuel, title: "Combustible", link: "https://tarifas-de-costo.netlify.app/combustible" },
    { src: DollarSign, title: "Tarifas", link: "https://tarifas-de-costo.netlify.app/tarifas" },
    { src: Navigation, title: "Zonas", link: "https://tarifas-de-costo.netlify.app/zonas" },
  ]
};