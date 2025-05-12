import Layout from "../../components/Layout";
import { useCallback, useState } from "react";
import { DriverType } from "../../types";
import { useDriver } from "../../hooks/useDriver";
import { FormDriver } from "../../components/driver/formDriver";
//import { SectioHeaderForm } from "../../components/HeaderForms";
import { SectionHeader } from "../../components/SectionHeader";

export default function DriverCreate ()  {

    const handleOpenDialog = useCallback((driver?: DriverType) => {
        if(driver) {
           
        }
    }, [])

    function handleSubmit(formData: Partial<DriverType>): void {
        throw new Error("Function not implemented.");
    }

    return(
        <>
            <SectionHeader
                title= "Registrar chofer"
                description= "Registre los choferes del sistema"
            />
            <FormDriver  
                onSubmit={handleSubmit}
            />
        </>

    );

}
