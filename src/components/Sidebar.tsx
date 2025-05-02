import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import home from "../assets/menu/home.svg";
import companies from "../assets/menu/companie.svg";
import trips from "../assets/menu/trip.svg";
import drivers from "../assets/menu/driver.svg";
import vehicles from "../assets/menu/vehicle.svg";
import depots from "../assets/menu/deposit.svg";
import { useState } from "react";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };
    return(
        <aside className={`flex ${isCollapsed ? 'w-20' : 'w-60'} bg-white border-r border-gray-200 shadow-md h-full relative transition-all duration-500 z-10`}>
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4 ">
                    <section className="flex gap-3 items-center h-20 p-4">
                        <Truck className="text-primary-orange size-8" />
                        {!isCollapsed && <h2 className="text-base font-semibold">Logística Acme SRL</h2>}
                        {/* Botón para contraer/expandir */}
                        <button
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                        className="absolute top-6 right-[-16px] bg-white p-1 rounded-full hover:bg-gray-100 transition-all duration-500 z-10 border border-gray-300"
                        >
                            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
                        </button>
                    </section>
                    <nav className="flex flex-1 h-full flex-col gap-3 p-1">
                        <Link to="/" 
                        className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={home} alt="Inicio" className=""/>
                            {!isCollapsed && "Inicio"}
                        </Link>
                        <Link to="/companies" className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={companies} alt="Empresas" />
                            {!isCollapsed && "Empresas"}
                        </Link>
                        
                        <Link to="/trips" className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={trips} alt="Viajes" />
                            {!isCollapsed && "Viajes"}
                        </Link>
                        <Link to="/drivers" className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={drivers} alt="Choferes" />
                            {!isCollapsed && "Choferes"}
                        </Link>
                        <Link to="/vehicles" className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={vehicles} alt="Vehículos" />
                            {!isCollapsed && "Vehículos"}
                        </Link>
                        <Link to="/depots" className="hover:text-primary-orange cursor-pointer flex items-center gap-4 h-16 p-4 hover:bg-menu-hover rounded-lg">
                            <img src={depots} alt="Depósitos" />
                            {!isCollapsed && "Depósitos"}
                        </Link>
                    </nav>
                </div>   
            </div>
        </aside>
    )
}