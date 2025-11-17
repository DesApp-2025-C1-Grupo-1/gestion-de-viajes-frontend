import { Grid, MenuItem, Select, Typography } from "@mui/material";
import { useEmpresaControllerFindAll } from "../../api/generated";

interface FilterCompanyProps {
    localFilters: Record<string, any>;
    handleChange: (key: string, value: string | number | null) => void;
}

export default function FilterCompany({ localFilters, handleChange }: FilterCompanyProps) {

    const {data, isLoading: loadingOptions} = useEmpresaControllerFindAll();

    const empresas = data?.data || [];

    return (
        <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="#666" mb={0.5}>Empresa</Typography>
            <Select
                fullWidth
                value={localFilters.nombre_comercial || ""}
                onChange={(e) => handleChange('empresa.nombre_comercial', e.target.value)}
                displayEmpty
            >
                <MenuItem value="" disabled>{loadingOptions ? "Cargando..." : "Seleccionar empresa"}</MenuItem>
                {empresas.map(emp => (<MenuItem key={emp._id} value={emp.nombre_comercial}>{emp.nombre_comercial}</MenuItem>))}
            </Select>
        </Grid>
    );
}