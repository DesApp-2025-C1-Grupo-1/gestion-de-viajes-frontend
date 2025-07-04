
import { TipoVehiculoDto } from "../../../api/generated";
import CardVehicle from "../CardVehicle";

interface VehicleGridProps {
  vehicleTypes: TipoVehiculoDto[];
  onEdit: (vehicleType: TipoVehiculoDto) => void;
  onDelete: (vehicleType: TipoVehiculoDto) => void;
}

export const VehicleGrid = ({ vehicleTypes, onEdit, onDelete }: VehicleGridProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5 overflow-y-auto max-h-[calc(100vh-120px)] lg:h-max">
    {vehicleTypes.map((vehicleType) => (
      <CardVehicle
        key={vehicleType._id}
        name={vehicleType.nombre}
        description={vehicleType.descripcion || ""}
        handleEdit={() => onEdit(vehicleType)}
        handleDelete={() => onDelete(vehicleType)}
      />
    ))}
  </div>
);