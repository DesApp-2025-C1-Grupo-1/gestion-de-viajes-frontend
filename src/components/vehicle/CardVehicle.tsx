import { Chip } from "@mui/material";
import { Edit, Package, Trash2, Truck } from "lucide-react";

interface CardVehicleProps {
    name: string;
    description: string;
    licenciaValida?: string;
    handleEdit?: () => void;
    handleDelete?: () => void;
}


export default function CardVehicle({ name, description, handleEdit, handleDelete, licenciaValida}: CardVehicleProps) { 
    
    return(
        <div className="flex justify-between flex-col gap-4  w-full  shadow-sm bg-white  rounded-lg hover:shadow-lg transition-shadow duration-200">
            <header className="flex items-center h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 justify-center w-full rounded-t-lg">
                <div className="bg-white p-4 rounded-full shadow-md text-primary-orange hover:scale-105 transition-transform duration-200">
                    <Package className={`size-7 block`} />
                </div>
            </header>
            <article className="flex flex-col gap-2.5 w-full px-4 pt-2 pb-3">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg text-title-type font-semibold">{name}</h2>
                    <Chip 
                        label={licenciaValida} 
                        size="small" 
                        variant="outlined" 
                        sx={{ fontSize: '0.75rem', px: 1, backgroundColor: '#F3F4F6' }} 
                    />
                </div>
                <p className="text-sm">{description}</p>
            </article>
            <footer className="flex h-max  items-center justify-end gap-4 px-4 py-3 border-t border-gray-200">
                <button className="flex gap-1 items-center text-xs font-medium px-2.5 py-2 rounded-md border border-line hover:text-white hover:bg-line transition-colors duration-200"
                onClick={handleEdit}>
                    <Edit className="size-4"/> 
                    Editar
                </button>
                <button className="flex gap-1 items-center text-xs font-medium px-2.5 py-2 rounded-md text-white bg-delete hover:bg-delete-hover transition-colors duration-200"
                onClick={handleDelete}>
                    <Trash2 className="size-4"/>  
                    Eliminar
                </button>
            </footer>
        </div>
    )
}