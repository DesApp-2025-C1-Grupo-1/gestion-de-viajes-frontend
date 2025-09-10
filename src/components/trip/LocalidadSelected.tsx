import { Grid, Menu, MenuItem, Select, Typography } from "@mui/material";
import { Provincia, useLocalidades } from "../../hooks/useGeoref";

interface Props {
    selectedProvincia: Provincia | null;
    selectedPais: string;
    selectedLocalidad: string;
    setSelectedLocalidad: (loc: string) => void;
}

export const LocalidadSelect = ({
    selectedProvincia,
    selectedPais,
    selectedLocalidad,
    setSelectedLocalidad,
}: Props) => {
    const { localidades, loading } = useLocalidades(selectedPais, selectedProvincia);

    return (
        <Grid item xs={12} md={6}>
            <Typography sx={{ color: "#5A5A65", fontSize: "0.9rem", mb: 1 }}>
                Localidad
            </Typography>
            <Select
                value={selectedLocalidad}
                fullWidth
                displayEmpty
                disabled={!selectedProvincia || loading}
                onChange={(e) => {
                    if (e.target.value === "all") {
                        setSelectedLocalidad("");
                    } else{
                        setSelectedLocalidad(e.target.value);
                    }

                }}
            >
                <MenuItem value="" disabled>
                {loading
                    ? "Cargando..."
                    : selectedProvincia
                    ? "Seleccione una localidad"
                    : "Seleccione una provincia primero"}
                </MenuItem>
                <MenuItem value="all">Todas las localidades</MenuItem>
                {localidades.map((loc) => (
                <MenuItem key={loc.id} value={loc.nombre}>
                    {loc.nombre}
                </MenuItem>
                ))}
            </Select>
        </Grid>
    );
};
