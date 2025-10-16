import { Building2, CalendarDays, ChartColumn, DollarSign, FileText, Fuel, Layers, Map, MapPin, Navigation, Package, Truck, User, Users, Warehouse } from "lucide-react";

export const sidebarMenus = {
  viajes: [
    { src: User, title: "Choferes", link: "drivers" },
    { src: Warehouse, title: "Depósitos", link: "depots" },
    { src: Building2, title: "Empresas", link: "companies" },
    { src: Truck, title: "Vehículos", link: "vehicles" },
    { src: Layers, title: "Tipos de Vehículos", link: "type-vehicle" },
    { src: Navigation, title: "Viajes", link: "trips/distribution" },
  ],
  remitos: [
    { src: CalendarDays, title: "Agenda", link: "https://remitos-front.netlify.app/agenda" },
    { src: Users, title: "Clientes", link: "https://remitos-front.netlify.app/clientes" },
    { src: MapPin, title: "Destinos", link: "https://remitos-front.netlify.app/destinos" },
    { src: FileText, title: "Remitos", link: "https://remitos-front.netlify.app/remitos" },
    { src: ChartColumn, title: "Reportes", link: "https://remitos-front.netlify.app/reportes" },
  ],
  costos: [
    { src: Layers, title: "Adicionales", link: "https://tarifas-de-costo.netlify.app/adicionales" },
    { src: Package, title: "Cargas", link: "https://tarifas-de-costo.netlify.app/tipos-de-carga" },
    { src: Fuel, title: "Combustible", link: "https://tarifas-de-costo.netlify.app/combustible" },
    { src: DollarSign, title: "Tarifas", link: "https://tarifas-de-costo.netlify.app/tarifas" },
    { src: Map, title: "Zonas", link: "https://tarifas-de-costo.netlify.app/zonas" },
  ]
};