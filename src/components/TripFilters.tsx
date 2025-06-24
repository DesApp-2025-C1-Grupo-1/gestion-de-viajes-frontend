import { useState } from "react";
import { BuscarViajeDto } from "../api/generated";
import { Stack, Button, Chip, Collapse, Paper, Typography, TextField, Select, MenuItem,Box, Grid  } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListFilter } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

export default function TripFilters({filterOpen, setFilterOpen}: {filterOpen: boolean, setFilterOpen: (open: boolean) => void}) {

        const [filters, setFilters] = useState({
        fechaDesde: null as Date | null,
        fechaHasta: null as Date | null,
        _id: '',
        origen: '',
        destino: '',
        empresa: '',
        vehiculo: '',
        chofer: '',
        tipoViaje: '',
    });
    const [appliedFilters, setAppliedFilters] = useState<typeof filters>({ ...filters });

     const handleChange = (key: keyof typeof filters, value: string | Date | null) => {
            setFilters((prev) => ({ ...prev, [key]: value }));
        };

     const handleApply = () => {
        const dto: BuscarViajeDto = {
            fecha_inicio: filters.fechaDesde? startOfDay(filters.fechaDesde).toISOString() : undefined,
            fecha_llegada: filters.fechaHasta? endOfDay(filters.fechaHasta).toISOString() : undefined,
            _id: filters._id || undefined,
            empresa: filters.empresa || undefined,
            chofer: filters.chofer || undefined,
            vehiculo: filters.vehiculo || undefined,
            tipo: filters.tipoViaje ? filters.tipoViaje as BuscarViajeDto['tipo'] : undefined,
        };

        console.log("Filtros enviados al backend:", dto);

        setAppliedFilters(filters);
        setFilterOpen(false);
    };
    const handleClear = () => {
        const empty = {
        fechaDesde: null,
        fechaHasta: null,
        _id: '',
        origen: '',
        destino: '',
        empresa: '',
        vehiculo: '',
        chofer: '',
        tipoViaje: '',
        };
        setFilters(empty);
        setAppliedFilters(empty);
    };

    const handleDelete = (key: keyof typeof filters) => {
        setAppliedFilters((prev) => ({ ...prev, [key]: key.includes('fecha') ? null : '' }));
        setFilters((prev) => ({ ...prev, [key]: key.includes('fecha') ? null : '' }));
    };

    const formatChipLabel = (key: string, value: any) => {
        const labels: Record<string, string> = {
            fechaDesde: 'Desde',
            fechaHasta: 'Hasta',
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
                            onDelete={() => handleDelete(key as keyof typeof filters)}
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
                            <Grid container spacing={2} sx={{color: "#5A5A65"}}>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Rango de fechas
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
                                            <DatePicker
                                                value={filters.fechaDesde}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Desde",
                                                    },
                                                }} 
                                                format="dd/MM/yyyy"
                                                onChange={(value) => handleChange('fechaDesde', value)}
                                            />
                                            <DatePicker
                                                value={filters.fechaHasta}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Hasta",
                                                        
                                                    },
                                                }} 
                                                format="dd/MM/yyyy"
                                                onChange={(value) => handleChange('fechaHasta', value)}
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
                                        value={filters._id}
                                        onChange={(e) => handleChange('_id', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} lg={4}>
                                    <Typography variant="subtitle2">
                                        Empresa transportista
                                    </Typography>
                                    <Select
                                        fullWidth
                                        value={filters.empresa}
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
                                        value={filters.vehiculo}
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
                                        value={filters.chofer}
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
                                <Grid item xs={12} sm={6} lg={4}>
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
                                </Grid>
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
                                                    backgroundColor: filters.tipoViaje === 'nacional' ? '#C94715' : 'white',
                                                    color: filters.tipoViaje === 'nacional' ? 'white' : '#5A5A65',
                                                    "&:hover": {
                                                        backgroundColor: filters.tipoViaje === 'nacional' ? '#C94715' : '#f5f5f5',
                                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)"
                                                    }
                                                }}
                                                onClick={() => handleChange('tipoViaje', filters.tipoViaje === 'nacional' ? '' : 'nacional')}
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
                                                    backgroundColor: filters.tipoViaje === 'internacional' ? '#C94715' : 'white',
                                                    color: filters.tipoViaje === 'internacional' ? 'white' : '#5A5A65',
                                                    "&:hover": {
                                                        backgroundColor: filters.tipoViaje === 'internacional' ? '#C94715' : '#f5f5f5',
                                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)"
                                                    },
                                                }}
                                                onClick={() => handleChange('tipoViaje', filters.tipoViaje === 'internacional' ? '' : 'internacional')}
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
                                        Object.values(filters).every(value => value === '') &&
                                        Object.values(appliedFilters).every(value => value === '')
                                    }
                                >
                                    Limpiar filtros
                                </Button>
                                <Button variant="contained" color="primary" sx={{ borderRadius: "6px", padding: "10px 20px", boxShadow: "none" ,"&:hover": { boxShadow: "none", backgroundColor: "#C94715" }}}
                                    onClick={handleApply}
                                    disabled={
                                        Object.values(filters).every(value => value === '') &&
                                        Object.values(appliedFilters).every(value => value === '')
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