import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEmpresaControllerFindAll, useVehiculoControllerFindAll } from "../../api/generated";

interface FilterVehicleProps {
    localFilters: Record<string, any>;
    handleChange: (key: string, value: string | number | null) => void;
}

export default function FilterVehicle({ localFilters, handleChange }: FilterVehicleProps) {

    const {data, isLoading: loadingOptions} = useVehiculoControllerFindAll();

    const vehicles = data?.data || [];

    return (
        <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="#666" mb={0.5}>Vehículo</Typography>
            <Select
                fullWidth
                value={localFilters.vehiculo?.patente || ""}
                onChange={(e) => handleChange('vehiculo.patente', e.target.value)}
                displayEmpty
            >
                <MenuItem value="" disabled>{loadingOptions ? "Cargando..." : "Seleccionar vehículo"}</MenuItem>
                {vehicles.map(vehicle => (
                    <MenuItem key={vehicle._id} value={vehicle.patente}>
                        {vehicle.modelo} - {vehicle.patente}
                    </MenuItem>
                ))}
            </Select>
        </Grid>
    );
}