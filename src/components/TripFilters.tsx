import { useCallback, useState } from "react";
import { BuscarViajeDto } from "../api/generated";
import { Stack, Button, Chip, Collapse, Paper, Typography, TextField, Select, MenuItem,Box, Grid  } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListFilter } from "lucide-react";
interface TripFiltersProps {
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    onApply: (filters: BuscarViajeDto) => void;
    initialFilters?: BuscarViajeDto;
}

export default function TripFilters({
    filterOpen, 
    setFilterOpen, 
    onApply, 
    initialFilters = {
        fecha_inicio: undefined,
        fecha_llegada: undefined,
        _id: '',
        empresa: '',
        vehiculo: '',
        chofer: '',
        tipo: undefined,
    }
}: TripFiltersProps) {
    const [localFilters, setLocalFilters] = useState<BuscarViajeDto>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<BuscarViajeDto>(initialFilters);

    const handleChange = useCallback((key: keyof typeof localFilters, value: string | Date | null) => {
        let adjustedValue: any = value;

        if (value instanceof Date) {
            const date = new Date(value);
            if (key === 'fecha_inicio') {
            date.setHours(0, 0, 0, 0);
            } else if (key === 'fecha_llegada') {
            date.setHours(23, 59, 59, 999);
            }
            adjustedValue = date.toISOString(); // opcional, según cómo manejes en backend
        }

        setLocalFilters((prev) => ({ ...prev, [key]: adjustedValue }));

    },[]);

    const handleApply = () => {
        setAppliedFilters(localFilters);
        onApply(localFilters);
        setFilterOpen(false);
    };
    
    const handleClear = () => {
        const empty ={
            fecha_inicio: undefined,
            fecha_llegada: undefined,
            _id: '',
            empresa: '',
            vehiculo: '',
            chofer: '',
            tipo: undefined,
        };
        setLocalFilters(empty);
        setAppliedFilters(empty);
        onApply(empty);
    }

    const handleDeleteChip = (key: keyof BuscarViajeDto) => {
        const clearedValue = key.includes('fecha') || key === "tipo" ? undefined : '';
        const updatedFilters = { ...appliedFilters, [key]: clearedValue };
        setAppliedFilters(updatedFilters);
        setLocalFilters(updatedFilters);
        console.log("Updated filters after chip delete:", updatedFilters);
        onApply(updatedFilters);
    };

    const formatChipLabel = (key: string, value: any) => {
        const labels: Record<string, string> = {
            fecha_inicio: 'Desde',
            fecha_llegada: 'Hasta',
            _id: 'N° Viaje',
            origen: 'Origen',
            destino: 'Destino',
            empresa: 'Empresa',
            vehiculo: 'Vehículo',
            chofer: 'Chofer',
            tipoViaje: 'Tipo',
        };
        return `${labels[key] || key}: ${key.includes('fecha') ? new Date(value).toLocaleDateString() : value}`;
    };

    return(
        <Box sx={{width: "100%", mb: 2}}>
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                    
                    <Button 
                        variant="contained"
                        onClick={() => setFilterOpen(!filterOpen)}
                        sx={{display: "flex", alignItems: "center", 
                            backgroundColor: "white", color: "#5A5A65",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "0.5px solid #C7C7C7",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
                            },
                            padding: "8px 20px"
                        }}
                        startIcon={<ListFilter className={`size-5 ${filterOpen && "rotate-180"} transtiton-all duration-200 ease-in`} />}
                    >
                        Filtros
                    </Button>
                    {Object.entries(appliedFilters)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => (
                        <Chip
                            key={key}
                            label={formatChipLabel(key, value)}
                            onDelete={() => handleDeleteChip(key as keyof BuscarViajeDto)}
                            variant="outlined"
                                sx={{
                                    backgroundColor: "#F0F4F8", 
                                    color: "#474752",
                                    fontWeight: "500",
                                    "& .MuiChip-deleteIcon": {
                                        color: "#5A5A65",
                                        transition: "color 0.2s",
                                    },
                            }}
                        />
                    ))}
                </Stack>

                <Collapse in={filterOpen} timeout="auto" unmountOnExit>
                    <Box sx={{ mt: 2 }}>
                        <Paper
                            elevation={3}
                            sx={{
                            p: 2,
                            backgroundColor: "white",
                            borderRadius: "8px",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                            border: "0.5px solid #c7c7c7"
                            }}
                        >
                            <Grid container spacing={4} sx={{color: "#5A5A65"}}>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Rango de fechas
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
                                            <DatePicker
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Desde",
                                                    },
                                                }} 
                                                format="dd/MM/yyyy"
                                                value={localFilters.fecha_inicio ? new Date(localFilters.fecha_inicio) : undefined}
                                                onChange={(value) => handleChange('fecha_inicio', value)}
                                            />
                                            <DatePicker
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Hasta",
                                                        
                                                    },
                                                }} 
                                                format="dd/MM/yyyy"
                                                value={localFilters.fecha_llegada ? new Date(localFilters.fecha_llegada) : undefined}
                                                onChange={(value) => handleChange('fecha_llegada', value)}
                                            />
                                        </Box>
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Número de viaje
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        className="inside-paper"
                                        placeholder="Buscar por ID de viaje"
                                        sx={{
                                            mt: 1,
                                        }}
                                        value={localFilters._id}
                                        onChange={(e) => handleChange('_id', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Empresa transportista
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={localFilters.empresa}
                                        onChange={(e) => handleChange('empresa', e.target.value)}
                                        displayEmpty
                                        sx={{ 
                                            backgroundColor: "white",  
                                            "& .MuiSelect-select": { padding: "10px 14px" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                            mt: 1,
                                        }}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar empresa
                                        </MenuItem>
                                        <MenuItem value="empresa1">Empresa 1</MenuItem>
                                        <MenuItem value="empresa2">Empresa 2</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Vehículo
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={localFilters.vehiculo}
                                        onChange={(e) => handleChange('vehiculo', e.target.value)}
                                        displayEmpty
                                        sx={{ 
                                            backgroundColor: "white", 
                                            "& .MuiSelect-select": { padding: "10px 14px" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                            mt: 1,
                                        }}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar vehículo
                                        </MenuItem>
                                        <MenuItem value="vehiculo1">Vehículo 1</MenuItem>
                                        <MenuItem value="vehiculo2">Vehículo 2</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Chofer
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={localFilters.chofer}
                                        onChange={(e) => handleChange('chofer', e.target.value)}
                                        displayEmpty
                                        sx={{ 
                                            backgroundColor: "white", 
                                            "& .MuiSelect-select": { padding: "10px 14px" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                            mt: 1,
                                        }}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar chofer
                                        </MenuItem>
                                        <MenuItem value="chofer1">Chofer 1</MenuItem>
                                        <MenuItem value="chofer2">Chofer 2</MenuItem>
                                    </Select>
                                </Grid>
                                {/* <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Depósito de origen
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={filters.origen}
                                        onChange={(e) => handleChange('origen', e.target.value)}
                                        displayEmpty
                                        sx={{ 
                                            backgroundColor: "white", 
                                            "& .MuiSelect-select": { padding: "10px 14px" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                            mt: 1,
                                        }}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar depósito
                                        </MenuItem>
                                        <MenuItem value="deposito1">Depósito 1</MenuItem>
                                        <MenuItem value="deposito2">Depósito 2</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Depósito de destino
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={filters.destino}
                                        onChange={(e) => handleChange('destino', e.target.value)}
                                        displayEmpty
                                        sx={{ 
                                            backgroundColor: "white", 
                                            "& .MuiSelect-select": { padding: "10px 14px" },
                                            "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                            mt: 1,
                                        }}
                                        inputProps={{ "aria-label": "Without label" }}
                                    >
                                        <MenuItem value="" disabled>
                                            Seleccionar depósito
                                        </MenuItem>
                                        <MenuItem value="deposito1">Depósito 1</MenuItem>
                                        <MenuItem value="deposito2">Depósito 2</MenuItem>
                                    </Select>
                                </Grid> */}
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Tipo de viaje
                                    </Typography>
                                    <Grid container sx={{ mt: 1 }} columnSpacing={2}>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    borderRadius: "6px ",
                                                    padding: "10px 14px",
                                                    textTransform: "none",
                                                    backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : 'white',
                                                    color: localFilters.tipo === 'nacional' ? 'white' : '#5A5A65',
                                                    "&:hover": {
                                                        backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : '#f5f5f5',
                                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)"
                                                    }
                                                }}
                                                onClick={() => handleChange('tipo', localFilters.tipo === 'nacional' ? '' : 'nacional')}
                                            >
                                                Nacional
                                            </Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                sx={{
                                                    borderRadius: "6px ",
                                                    padding: "10px 14px",
                                                    textTransform: "none",
                                                    backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : 'white',
                                                    color: localFilters.tipo === 'internacional' ? 'white' : '#5A5A65',
                                                    "&:hover": {
                                                        backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : '#f5f5f5',
                                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)"
                                                    },
                                                }}
                                                onClick={() => handleChange('tipo', localFilters.tipo === 'internacional' ? '' : 'internacional')}
                                            >
                                                Internacional
                                            </Button>
                                        </Grid>

                                    </Grid> 
                                </Grid>
                            </Grid>

                            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                                <Button variant="outlined" color="primary" sx={{ borderRadius: "6px", padding: "10px 20px", }}
                                    onClick={handleClear}
                                    disabled={
                                        Object.values(localFilters).every(value => value === '')
                                    }
                                >
                                    Limpiar filtros
                                </Button>
                                <Button variant="contained" color="primary" sx={{ borderRadius: "6px", padding: "10px 20px", boxShadow: "none" ,"&:hover": { boxShadow: "none", backgroundColor: "#C94715" }}}
                                    onClick={handleApply}
                                    disabled={
                                        Object.values(localFilters).every(value => value === '')
                                    }
                                >
                                    Aplicar filtros
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Collapse>
                
            </Box>
    )
}