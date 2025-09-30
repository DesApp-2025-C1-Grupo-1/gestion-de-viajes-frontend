import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import HomeIcon from "./icons/HomeIcon";
import DriverIcon from "./icons/DriverIcon";
import VehicleIcon from "./icons/VehicleIcon";
import DepotIcon from "./icons/DepotIcon";
import TripIcon from "./icons/TripIcon";
import CompanyIcon from "./icons/CompanyIcon";
import { useEffect, useState } from "react";
import OptionMenu from "./OptionMenu";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({isVisible, setIsVisible}: SidebarProps) {
  const navigate = useNavigate();
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
    { src: TripIcon, title: "Viajes", link: "trips/distribution" },
    { src: DriverIcon, title: "Choferes", link: "drivers" },
    { src: VehicleIcon, title: "Vehículos", link: "vehicles" },
    { src: DepotIcon, title: "Depósitos", link: "depots" }
  ];

  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
  
      // Si pasás a mobile, expandí el sidebar
      if (mobile) {
        setIsCollapsed(false);
      }
    };
  
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectOption =() => {
    setIsVisible(false);
  }

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-md z-40
        flex flex-col
        ${isVisible ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:relative 
        ${isCollapsed ? 'w-16' : 'w-60'} transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
      `}
    >
        {/* Encabezado */}
        <div 
          className="flex items-center px-3 border-b border-gray-100 relative" 
          onClick={() => navigate("/")}
          style={{ cursor: 'pointer' }}
          aria-label="Ir a la página de inicio"
        >
            <img 
              src={isCollapsed ? "/logo_chico.png" : "/logo.jpg"}
              alt="Gestión de viajes logo con camión naranja sobre fondo blanco, transmite profesionalismo y confianza"  
              className={`min-h-12 my-3 mx-auto object-contain transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                ${isCollapsed ? 'w-full' : 'w-full'}
              `} 

            />
        </div>

        {/* Menú */}
        <nav className="flex-1 overflow-y-auto py-3 px-0"> {/* Cambiado px-2 a px-0 */}
            <div className="flex flex-col gap-1 p-1 items-center"> {/* Añadido items-center */}
                {menuItems.map((item) => (
                <OptionMenu
                    key={item.link || 'home'}
                    isCollapsed={isCollapsed}
                    onClick={selectOption}
                    IconComponent={item.src}
                    title={item.title}
                    link={item.link}
                />
                ))}
            </div>
        </nav>

        {/* Botón de cerrar */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
            className={`
              absolute top-7  -right-3 bg-white p-1 rounded-full border border-gray-300
              hover:bg-gray-100 transition-all shadow-sm z-10
              ${isVisible ? 'hidden' : 'hidden md:block'}
            `}
          >
            {isCollapsed ? (
                <ChevronRight className="size-4 text-gray-600" />
            ) : (
                <ChevronLeft className="size-4 text-gray-600" />
            )}
          </button>
        )}


    </aside>
  );
}