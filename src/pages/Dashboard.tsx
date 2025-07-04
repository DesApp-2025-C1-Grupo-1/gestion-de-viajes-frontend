import { SectionHeader } from "../components/SectionHeader";
//import {  CircularProgress } from "@mui/material";
import { useDashboard } from "../hooks/useDashboard";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../components/dashboard/CardDash";
import { UserRoundCheck, Building2 } from "lucide-react";
import { TableContainer } from "@mui/material";


export default function Dashboard() {
    //modificar
    const { empresas, choferes, ultimosViajes, isLoading } = useDashboard();
    const navigate = useNavigate();

    return (
        <>
            <SectionHeader
                title="Logística Acme SRL"
                description="Bienvenido al panel de administración de la aplicación."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5 overflow-y-auto max-h-[calc(100vh-120px)] lg:h-max">
                <DashboardCard 
                    title="Empresas transportistas"
                    description="Empresas registradas actualmente"
                    value={12}
                    icon={<Building2 className={`size-7 block`} color="#E65F2B"/>} 
                    onClick={() => navigate("/companies")}
                />
                <DashboardCard 
                    title="Choferes"
                    description="Choferes registrados actualmente"
                    value={7}
                    icon={<UserRoundCheck className={`size-7 block`} color="#E65F2B"/>}
                    onClick={() => navigate("/drivers")}
                />
            </div>

            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",}}>


            </div>
 
        </>      
    );
}