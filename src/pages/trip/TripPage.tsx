import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Box, Button, Chip, Collapse, Grid, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { ListFilter } from "lucide-react";
import { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";


export default function TripPage() {
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        fechaDesde: '',
        fechaHasta: '',
        _id: '',
        origen: '',
        destino: '',
        empresa: '',
        vehiculo: '',
        chofer: '',
        tipoViaje: '',
    });
    const [appliedFilters, setAppliedFilters] = useState<typeof filters>({ ...filters });

     const handleChange = (key: keyof typeof filters, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        setAppliedFilters(filters);
        setFilterOpen(false);
    };

    const handleClear = () => {
        const empty = {
        fechaDesde: '',
        fechaHasta: '',
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
        const updated = { ...appliedFilters, [key]: '' };
        setAppliedFilters(updated);
        setFilters((prev) => ({ ...prev, [key]: '' }));
    };

    const formattedFilters: Record<keyof typeof filters, string> = {
        fechaDesde: 'Fecha desde',
        fechaHasta: 'Fecha hasta',
        _id: 'Número de viaje',
        origen: 'Origen',
        destino: 'Destino',
        empresa: 'Empresa',
        vehiculo: 'Vehículo',
        chofer: 'Chofer',
        tipoViaje: 'Tipo de viaje',
    };

    return(
        <>
            <SectionHeader
                title="Viaje"
                description="Aquí puedes ver los detalles del viaje, incluyendo la información de los pasajeros, el itinerario y las reservas."
                buttonText="Nuevo viaje"
                onAdd={() => navigate('/trips/form')}
            />
            <Box sx={{width: "100%", mb: 2}}>
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1}>
                    
                    <Button 
                        variant="contained"
                        onClick={() => setFilterOpen(!filterOpen)}
                        sx={{display: "flex", alignItems: "center", 
                            backgroundColor: "white", color: "#5A5A65",
                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "1px solid #c7c7c7",
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
                                label={`${formattedFilters[key as keyof typeof formattedFilters] }: ${value}`}
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
                        ))
                    }
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
                            border: "1px solid #c7c7c7"
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
                                                value={null}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Desde",
                                                    },
                                                }} 
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { 
                                                        borderRadius: "4px !important",
                                                    },
                                                }}  
                                            />
                                            <DatePicker
                                                value={null}
                                                slotProps={{
                                                    textField: {
                                                        fullWidth: true,
                                                        className: "inside-paper",
                                                        placeholder: "Hasta",
                                                        
                                                    },
                                                }}   
                                                sx={{
                                                    "& .MuiOutlinedInput-root fieldset": { 
                                                        borderRadius: "4px !important",
                                                    },
                                                }}
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
                                            "& input": {
                                                borderRadius: "4px",
                                            },
                                            "& .MuiOutlinedInput-root fieldset": { 
                                                borderRadius: "4px !important",
                                            },
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
                                            borderRadius: "4px", 
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
                                            borderRadius: "4px", 
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
                                            borderRadius: "4px", 
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
                                            borderRadius: "4px", 
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
                                            borderRadius: "4px", 
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
                                                    borderRadius: "4px",
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
                                                    borderRadius: "4px",
                                                    padding: "10px 14px",
                                                    textTransform: "none",
                                                    backgroundColor: filters.tipoViaje === 'internacional' ? '#C94715' : 'white',
                                                    color: filters.tipoViaje === 'internacional' ? 'white' : '#5A5A65',
                                                    "&:hover": {
                                                        backgroundColor: filters.tipoViaje === 'internacional' ? '#C94715' : '#f5f5f5',
                                                        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)"
                                                    }
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
                                <Button variant="outlined" color="primary" sx={{ borderRadius: "2px", padding: "10px 20px", }}
                                    onClick={handleClear}
                                    disabled={
                                        Object.values(filters).every(value => value === '') &&
                                        Object.values(appliedFilters).every(value => value === '')
                                    }
                                >
                                    Limpiar filtros
                                </Button>
                                <Button variant="contained" color="primary" sx={{ borderRadius: "2px", padding: "10px 20px", boxShadow: "none" ,"&:hover": { boxShadow: "none", backgroundColor: "#C94715" }}}
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
        </>
    )
}