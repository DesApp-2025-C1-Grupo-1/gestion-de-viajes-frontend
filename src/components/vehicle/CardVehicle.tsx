import { Chip } from "@mui/material";
import { 
    Edit, 
    Trash2, 
    Truck,
    Package,
    Snowflake,
    Droplet,
} from "lucide-react";

interface CardVehicleProps {
    name: string;
    description: string;
    licenciaValida?: string;
    handleEdit?: () => void;
    handleDelete?: () => void;
}

export const iconMap: Record<string, JSX.Element> = {
  // Refrigerado
  "Camión Frigorífico": <Snowflake size={24} />,

  // Transporte de líquidos
  "Camión Cisterna": <Droplet size={24} />,

  // Vehículos de reparto chico o urbano
  "Camioneta Pickup": <Package size={24} />,
  "Furgón Cerrado": <Package size={24} />,

  // Todos los demás como camiones
};

const getLicenseSx = (licenseType: string) => {
  const styles: Record<string, any> = {
    B1: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    B2: { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fecaca" },
    C1: { backgroundColor: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" },
    C2: { backgroundColor: "#ede9fe", color: "#5b21b6", borderColor: "#ddd6fe" },
    C3: { backgroundColor: "#d1fae5", color: "#047857", borderColor: "#a7f3d0" },
    D1: { backgroundColor: "#fef9c3", color: "#92400e", borderColor: "#fde68a" },
    D2: { backgroundColor: "#fef9c3", color: "#92400e", borderColor: "#fde68a" },
    D3: { backgroundColor: "#fef9c3", color: "#92400e", borderColor: "#fde68a" },
    E1: { backgroundColor: "#ffedd5", color: "#c2410c", borderColor: "#fdba74" },
    E2: { backgroundColor: "#ffedd5", color: "#c2410c", borderColor: "#fdba74" },
  };

  return {
    px: 1,
    fontWeight: 600,
    borderWidth: 1,
    ...styles[licenseType] || {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      borderColor: "#e5e7eb",
    },
  };
};


export default function CardVehicle({ name, description, handleEdit, handleDelete, licenciaValida}: CardVehicleProps) { 
    
    const icono = iconMap[name] || <Truck size={24} />; // fallback genérico

    return(
        <div className="flex justify-between flex-col gap-4  w-full  shadow-sm bg-white  rounded-lg hover:shadow-lg transition-shadow duration-200">
            <header className="flex items-center h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 justify-center w-full rounded-t-lg">
                <div className="bg-white p-4 rounded-full shadow-md text-primary-orange hover:scale-105 transition-transform duration-200">
                    {icono}
                </div>
            </header>
            <article className="flex flex-col gap-2.5 w-full px-4 pt-2 pb-3">
                <div className="flex justify-between items-center w-full">
                    <h2 className="text-lg text-title-type font-semibold">{name}</h2>
                    <Chip 
                        label={licenciaValida} 
                        size="small"
                        variant="outlined"
                        sx={getLicenseSx(licenciaValida || '')}
                        data-testid="license-chip"
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