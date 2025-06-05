import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Driver } from "../../types";
import { FormDriver } from "../../components/driver/formDriver";
import { SectionHeader } from "../../components/SectionHeader";
import { companies, vehicles } from "../../lib/mock-data";
import { fetchDriverById , createDriver, updateDriver } from "../../lib/apiDriver";

export default function DriverCreateEdit ()  {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = !!id; 
    const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if(isEditing && id){
            setLoading(true);
            fetchDriverById(id!).then((driver) => setEditingDriver(driver));
        }
    },[id])

    const handleSubmit = async (FormData: Partial<Driver>) => {
        try{
          if(isEditing && id){
            await updateDriver(id, FormData);
            }
            else{
                await createDriver(FormData);
            }
            navigate('/drivers');
        }
        catch (err) {
            console.error("Error al guardar el chofer", err);
        }
};

    return(
        <>
            <SectionHeader
                title= {isEditing? "Editar chofer" : "Registrar chofer"}
                description= {isEditing? "Modificar los datos del chofer" : "Cargar datos del chofer"}
            />
            <FormDriver  
                onSubmit={handleSubmit}
                editingDriver={editingDriver}
                companies={companies}
                vehicles={vehicles}  
                isEditing={isEditing}
            />
        </>
    );

}
