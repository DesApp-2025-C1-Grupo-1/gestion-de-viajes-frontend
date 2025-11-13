import {
  Building2,
  CalendarDays,
  ChartColumn,
  DollarSign,
  FileText,
  Fuel,
  Layers,
  Map,
  MapPin,
  Navigation,
  Package,
  Truck,
  User,
  Users,
  Warehouse,
} from "lucide-react";

/* -------------------- Configuración de URLs base -------------------- */

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const FRONTEND_URLS = {
  viajes: isLocal
    ? "http://localhost:8085"
    : "https://gestion-de-viajes.vercel.app",

  remitos: isLocal
    ? "http://localhost:8081"
    : "https://remitos-front.netlify.app",

  tarifas: isLocal
    ? "http://localhost:8080"
    : "https://tarifas-de-costo.netlify.app",
};

/* -------------------- Detectar app actual -------------------- */

export const getCurrentApp = () => {
  const hostname = window.location.hostname;

  if (hostname.includes("viaje") || hostname.includes("8085")) return "viajes";
  if (hostname.includes("remito") || hostname.includes("8081")) return "remitos";
  if (hostname.includes("tarifa") || hostname.includes("8080")) return "tarifas";
  return "viajes"; // fallback
};

const currentApp = getCurrentApp();

/* -------------------- Función helper: arma URL absoluta o relativa -------------------- */

const makeLink = (app: keyof typeof FRONTEND_URLS, path: string, isExternal = false) => {
  // si el link es interno (mismo dominio), usar ruta relativa
  if (app === currentApp && !isExternal) return path;

  // si es de otra app o marcado como externo → usar URL absoluta
  const baseUrl = FRONTEND_URLS[app];
  return `${baseUrl}/${path}`;
};

/* -------------------- Menús del sidebar -------------------- */

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
    { src: CalendarDays, title: "Agenda", link: makeLink("remitos", "agenda", true) },
    { src: Users, title: "Clientes", link: makeLink("remitos", "clientes", true) },
    { src: MapPin, title: "Destinos", link: makeLink("remitos", "destinos", true) },
    { src: FileText, title: "Remitos", link: makeLink("remitos", "remitos", true) },
    { src: ChartColumn, title: "Reportes", link: makeLink("remitos", "reportes", true) },
  ],

  costos: [
    { src: Layers, title: "Adicionales", link: makeLink("tarifas", "adicionales", true) },
    { src: Package, title: "Cargas", link: makeLink("tarifas", "tipos-de-carga", true) },
    { src: Fuel, title: "Combustible", link: makeLink("tarifas", "combustible", true) },
    { src: DollarSign, title: "Tarifas", link: makeLink("tarifas", "tarifas", true) },
    { src: Map, title: "Zonas", link: makeLink("tarifas", "zonas", true) },
  ],
};
