import { Autocomplete, TextField } from "@mui/material";
import { useTipoVehiculoControllerFindAll } from "../../api/generated";

interface FilterTypeVehicleProps{
    localFilters: Record<string, any>;
    handleChange: (key: string, value: string | number | null) => void;
}

export default function FilterTypeVehicle({ localFilters, handleChange }: FilterTypeVehicleProps) {
    
    const {data, isLoading} = useTipoVehiculoControllerFindAll();

    const typeVehicle = data?.data || [];

    return (
        <Autocomplete
            disablePortal
            id="type-autocomplete"
            options={typeVehicle}
            loading={isLoading}
            noOptionsText="No hay tipos de vehículo disponibles"
            getOptionLabel={(option) => option?.nombre ?? ""}
            isOptionEqualToValue={(option, value) => option._id === value._id}
            value={typeVehicle.find(t => t.nombre === localFilters["tipo.nombre"]) ?? null}
            onChange={(event, newValue) => {
                const valueToSet = newValue ? newValue.nombre : null;
                handleChange("tipo.nombre", valueToSet);
            }}
            filterOptions={(options, { inputValue }) =>
                options.filter((option) =>
                    option.nombre
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
                )
            }
            renderInput={(params) => (
                <TextField
                    {...params}
                    placeholder={
                        isLoading ? "Cargando tipos de vehículo..." : "Seleccionar tipo de vehículo"
                    }
                    size="small"
                    fullWidth
                    className="inside-paper"
                />
            )}
        />
    );
}