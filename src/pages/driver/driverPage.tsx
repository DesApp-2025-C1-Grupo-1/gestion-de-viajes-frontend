import Layout from "../../components/Layout";
import { useCallback, useState } from "react";
import { DriverType } from "../../types";
import { useDriver } from "../../hooks/useDriver";
import { SectionHeader } from "../../components/SectionHeader";
import DriverCreate from "./driverCreate";

export default function DriverPage() {
    const [openForm, setOpenForm] = useState(false);

    const handleOpenForm = useCallback(() => setOpenForm(true), []);
    const handleCloseForm = useCallback(() => setOpenForm(true), []);

    return(
        <>
        
            <SectionHeader
                title="Listado de choferes"
                description="Gestione los choferes disponibles en el sistema"
                buttonText="Nuevo chofer"
                onAdd={handleOpenForm}
            />
            {/*table pendiente*/}
        </>    
        
        );
}
