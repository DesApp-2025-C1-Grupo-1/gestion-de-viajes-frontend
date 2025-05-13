import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import HomeIcon from "./icons/HomeIcon";
import DriverIcon from "./icons/DriverIcon";
import DepotIcon from "./icons/DepotIcon";
import VehicleIcon from "./icons/VehicleIcon";
import TripIcon from "./icons/TripIcon";
import CompanyIcon from "./icons/CompanyIcon";
import { useState } from "react";
import OptionMenu from "./OptionMenu";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleSidebar = () => {
    setIsTransitioning(true);
    setIsCollapsed(prev => !prev);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const menuItems = [
    { src: HomeIcon, title: "Inicio", link: "" },
    { src: CompanyIcon, title: "Empresas", link: "companies" },
    { src: TripIcon, title: "Viajes", link: "trips" },
    { src: DriverIcon, title: "Choferes", link: "drivers" },
    { src: VehicleIcon, title: "Vehículos", link: "vehicles" },
    { src: DepotIcon, title: "Depósitos", link: "depots" }
  ];

  return (
    <aside 
      className={`
        flex flex-col h-full bg-white border-r border-gray-200 shadow-md
        ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 relative
      `}
    >
        {/* Encabezado */}
        <div className="flex items-center h-20 px-4 border-b border-gray-100 relative">
            <Truck className="text-[#E65F2B] size-8 shrink-0" />
            <h2 
            className={`
                text-base font-semibold ml-3 whitespace-nowrap
                transition-all duration-300
                ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0' : 'opacity-100 translate-x-0 w-auto'}
            `}
            >
            Logística Acme SRL
            </h2>
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto py-3 px-0"> {/* Cambiado px-2 a px-0 */}
            <div className="flex flex-col gap-1 p-1 items-center"> {/* Añadido items-center */}
                {menuItems.map((item) => (
                <OptionMenu
                    key={item.link || 'home'}
                    isCollapsed={isCollapsed}
                    IconComponent={item.src}
                    title={item.title}
                    link={item.link}
                />
                ))}
            </div>
        </nav>

        <button
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
          className={`
            absolute top-7  -right-3 bg-white p-1 rounded-full border border-gray-300
            hover:bg-gray-100 transition-all shadow-sm z-10
          `}
        >
          {isCollapsed ? (
              <ChevronRight className="size-4 text-gray-600" />
          ) : (
              <ChevronLeft className="size-4 text-gray-600" />
          )}
        </button>
    </aside>
  );
}