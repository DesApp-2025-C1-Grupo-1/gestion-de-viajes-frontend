import { useCallback, useState } from "react";
import { BuscarViajeDistribucionDto, BuscarViajeDto, ChoferDto, DepositoDto, EmpresaDto, RemitoDto, VehiculoDto } from "../api/generated";
import { Stack, Button, Chip, Collapse, Paper, Typography, TextField, Select, MenuItem,Box, Grid  } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ListFilter } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripFiltersProps {
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    onApply: (filters: BuscarViajeDistribucionDto) => void;
    initialFilters?: BuscarViajeDistribucionDto;
    empresas: EmpresaDto[];
    vehiculos: VehiculoDto[];
    choferes: ChoferDto[];
    depositos: DepositoDto[];
    remitos: RemitoDto[];
    loadingOptions: {
        empresas: boolean;
        vehiculos: boolean;
        choferes: boolean;
        depositos: boolean;
        remitos: boolean;
        tarifas: boolean;
    };
}

export default function DistributionFilters({
    filterOpen,
    setFilterOpen,
    onApply,
    initialFilters = {
        fecha_inicio: undefined,
        _id: '',
        transportista: '',
        chofer: '',
        vehiculo: '',
        tipo: undefined,
        origen: '',
        remito: [],
        tarifa: undefined,
    },
    empresas,
    vehiculos,
    choferes,
    depositos,
    remitos,
    loadingOptions
}: TripFiltersProps) {
    const [localFilters, setLocalFilters] = useState<BuscarViajeDistribucionDto>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<BuscarViajeDistribucionDto>(initialFilters);
    const navigate = useNavigate();

    const handleChange = useCallback((key: keyof BuscarViajeDistribucionDto, value: string | Date | number | number[] | null | undefined) => {
        let adjustedValue: any = value;
    
        if (value instanceof Date) {
            const date = new Date(value);
            date.setHours(0, 0, 0, 0);
            adjustedValue = date.toISOString();
        }
    
        setLocalFilters(prev => ({ ...prev, [key]: adjustedValue }));
    }, []);

    const handleApply = () => {
        setAppliedFilters(localFilters);
        onApply(localFilters);
        setFilterOpen(false);
    };

    const handleClear = () => {
        const empty: BuscarViajeDistribucionDto = {
            fecha_inicio: undefined,
            _id: '',
            transportista: '',
            chofer: '',
            vehiculo: '',
            tipo: undefined,
            origen: '',
            remito: [],
            tarifa: undefined,
        };
        setLocalFilters(empty);
        setAppliedFilters(empty);
        onApply(empty);
    };

    const handleDeleteChip = (key: keyof BuscarViajeDistribucionDto) => {
        const clearedValue = key === 'tipo' || key === 'fecha_inicio' ? undefined : key === 'remito' ? [] : '';
        const updatedFilters = { ...appliedFilters, [key]: clearedValue };
        setAppliedFilters(updatedFilters);
        setLocalFilters(updatedFilters);
        onApply(updatedFilters);
    };

    const nameEmpresaChip = (id: string) => empresas.find(e => e._id === id)?.nombre_comercial || 'Empresa no encontrada';
    const nameVehiculoChip = (id: string) => vehiculos.find(v => v._id === id) ? `${vehiculos.find(v => v._id === id)!.modelo} - ${vehiculos.find(v => v._id === id)!.patente}` : 'Vehículo no encontrado';
    const nameChoferChip = (id: string) => choferes.find(c => c._id === id) ? `${choferes.find(c => c._id === id)!.nombre} ${choferes.find(c => c._id === id)!.apellido}` : 'Chofer no encontrado';
    const nameDepositoChip = (id: string) => depositos.find(d => d._id === id)?.nombre || 'Depósito no encontrado';

    const formatChipLabel = (key: string, value: any) => {
        switch (key) {
            case 'fecha_inicio':
                return `Desde: ${value ? new Date(value).toLocaleDateString() : ''}`;
            case '_id':
                return `N° Viaje: ${value}`;
            case 'transportista':
                return `Transportista: ${nameEmpresaChip(value)}`;
            case 'vehiculo':
                return `Vehículo: ${nameVehiculoChip(value)}`;
            case 'chofer':
                return `Chofer: ${nameChoferChip(value)}`;
            case 'origen':
                return `Origen: ${nameDepositoChip(value)}`;
            case 'tipo':
                return `Tipo: ${value}`;
            case 'remito':
                return `Remitos: ${value.join(', ')}`;
            case 'tarifa':
                return `Tarifa: ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    return (
        <Box sx={{ width: "100%", mb: 2 }}>
          <Stack sx={{
            display: "flex",
            flexDirection: "column-reverse", // mobile
            gap: 1.5,
            "@media (min-width:640px)": {
              flexDirection: "row", // a partir de 640px
              justifyContent: "space-between",
            },
          }}>
            {/* Botón Filtros */}
            <Button
              variant="contained"
              onClick={() => setFilterOpen(!filterOpen)}
              sx={{
                display: "flex", alignItems: "center",
                backgroundColor: "white", color: "#5A5A65",
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", borderRadius: "8px", border: "0.5px solid #C7C7C7",
                "&:hover": { backgroundColor: "#f5f5f5", boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" },
                padding: "8px 20px"
              }}
              startIcon={<ListFilter className={`size-5 ${filterOpen && "rotate-180"} transtiton-all duration-200 ease-in`} />}
            >
              Filtros
            </Button>

            {/* Botón Viajes */}
            <Button
              variant="contained"
              onClick={() => navigate("/trips/collection")} 
              sx={{
                backgroundColor: "#00A86B",
                textTransform: "none",
                borderRadius: "8px",
                fontWeight: "500",
                boxShadow: "none",
                '&:hover': {
                    backgroundColor: "#008c5a",
                    boxShadow: "none",
                },
              }}
              className="md:pt-2 pb-3 sm:pb-5 sm:max-w-max"
            >
              Viajes
            </Button>
          </Stack>

          {/* Segunda fila: Chips debajo del botón Filtros */}
          {appliedFilters && Object.values(appliedFilters).some(
              value => value && (Array.isArray(value) ? value.length > 0 : true)
            ) && (
              <Stack sx={{ marginTop: "16px" }} direction="row" flexWrap="wrap" gap={1}>
                {Object.entries(appliedFilters)
                  .filter(([_, value]) => value && (Array.isArray(value) ? value.length > 0 : true))
                  .map(([key, value]) => (
                    <Chip
                      key={key}
                      label={formatChipLabel(key, value)}
                      onDelete={() => handleDeleteChip(key as keyof BuscarViajeDistribucionDto)}
                      variant="outlined"
                      sx={{
                        backgroundColor: "#F0F4F8",
                        color: "#474752",
                        fontWeight: "500",
                        "& .MuiChip-deleteIcon": { color: "#5A5A65", transition: "color 0.2s" },
                      }}
                    />
                ))}
              </Stack>
          )}

            <Collapse in={filterOpen} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2 }}>
                    <Paper elevation={3} sx={{ p: 2, backgroundColor: "white", borderRadius: "8px", boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #c7c7c7" }}>
                        <Grid container spacing={4} sx={{ color: "#5A5A65" }}>
                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Rango de fechas</Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
                                        <DatePicker
                                            slotProps={{ textField: { fullWidth: true, className: "inside-paper", placeholder: "Desde" } }}
                                            value={localFilters.fecha_inicio ? new Date(localFilters.fecha_inicio) : undefined}
                                            onChange={(value) => handleChange('fecha_inicio', value)}
                                        />
                                    </Box>
                                </LocalizationProvider>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Número de viaje</Typography>
                                <TextField
                                    fullWidth
                                    className="inside-paper"
                                    placeholder="Buscar por ID de viaje"
                                    sx={{ mt: 1 }}
                                    value={localFilters._id}
                                    onChange={(e) => handleChange('_id', e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Transportista</Typography>
                                <Select
                                    fullWidth
                                    value={localFilters.transportista}
                                    onChange={(e) => handleChange('transportista', e.target.value)}
                                    displayEmpty
                                    sx={{ backgroundColor: "white", "& .MuiSelect-select": { padding: "10px 14px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" }, mt: 1 }}
                                >
                                    <MenuItem value="" disabled>{loadingOptions.empresas ? "Cargando..." : "Seleccionar transportista"}</MenuItem>
                                    {empresas.map(emp => (<MenuItem key={emp._id} value={emp._id}>{emp.nombre_comercial}</MenuItem>))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Vehículo</Typography>
                                <Select
                                    fullWidth
                                    value={localFilters.vehiculo}
                                    onChange={(e) => handleChange('vehiculo', e.target.value)}
                                    displayEmpty
                                    sx={{ backgroundColor: "white", "& .MuiSelect-select": { padding: "10px 14px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" }, mt: 1 }}
                                >
                                    <MenuItem value="" disabled>{loadingOptions.vehiculos ? "Cargando..." : "Seleccionar vehículo"}</MenuItem>
                                    {vehiculos.map(veh => (<MenuItem key={veh._id} value={veh._id}>{veh.modelo} - {veh.patente}</MenuItem>))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Chofer</Typography>
                                <Select
                                    fullWidth
                                    value={localFilters.chofer}
                                    onChange={(e) => handleChange('chofer', e.target.value)}
                                    displayEmpty
                                    sx={{ backgroundColor: "white", "& .MuiSelect-select": { padding: "10px 14px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" }, mt: 1 }}
                                >
                                    <MenuItem value="" disabled>{loadingOptions.choferes ? "Cargando..." : "Seleccionar chofer"}</MenuItem>
                                    {choferes.map(c => (<MenuItem key={c._id} value={c._id}>{c.nombre} {c.apellido}</MenuItem>))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Depósito de origen</Typography>
                                <Select
                                    fullWidth
                                    value={localFilters.origen}
                                    onChange={(e) => handleChange('origen', e.target.value)}
                                    displayEmpty
                                    sx={{ backgroundColor: "white", "& .MuiSelect-select": { padding: "10px 14px" }, "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" }, mt: 1 }}
                                >
                                    <MenuItem value="" disabled>{loadingOptions.depositos ? "Cargando..." : "Seleccionar depósito"}</MenuItem>
                                    {depositos.map(d => (<MenuItem key={d._id} value={d._id}>{d.nombre}</MenuItem>))}
                                </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Tipo de viaje</Typography>
                                <Grid container sx={{ mt: 1 }} columnSpacing={2}>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderRadius: "6px", padding: "10px 14px", textTransform: "none",
                                                backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : 'white',
                                                color: localFilters.tipo === 'nacional' ? 'white' : '#5A5A65',
                                                "&:hover": { backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : '#f5f5f5', boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }
                                            }}
                                            onClick={() => handleChange('tipo', localFilters.tipo === 'nacional' ? undefined : 'nacional')}
                                        >Nacional</Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                borderRadius: "6px", padding: "10px 14px", textTransform: "none",
                                                backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : 'white',
                                                color: localFilters.tipo === 'internacional' ? 'white' : '#5A5A65',
                                                "&:hover": { backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : '#f5f5f5', boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }
                                            }}
                                            onClick={() => handleChange('tipo', localFilters.tipo === 'internacional' ? undefined : 'internacional')}
                                        >Internacional</Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Remito</Typography>
                                  <Select
                                    fullWidth
                                    multiple
                                    value={localFilters.remito || []}
                                    onChange={(e) => {
                                      const value = e.target.value as string[];
                                      const remitoIds = Array.from(value.map(Number)); 
                                      handleChange("remito", remitoIds);
                                    }}
                                    displayEmpty
                                    renderValue={(selected) => {
                                      if (!selected || (Array.isArray(selected) && selected.length === 0)) {
                                        return <p>Seleccionar remitos</p>; // placeholder visible
                                      }
                                      return Array.isArray(selected) ? selected.join(", ") : selected;
                                    }}
                                    sx={{
                                      backgroundColor: "white",
                                      "& .MuiSelect-select": { padding: "10px 14px" },
                                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#c7c7c7" },
                                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#5A5A65" },
                                      mt: 1,
                                    }}
                                  >
                                    {loadingOptions.remitos ? (
                                      <MenuItem disabled>Cargando...</MenuItem>
                                    ) : (
                                      remitos.map((rem) => (
                                        <MenuItem key={rem.id} value={rem.id}>
                                          {rem.id}
                                        </MenuItem>
                                      ))
                                    )}
                                  </Select>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={4}>
                                <Typography variant="subtitle2">Tarifa</Typography>
                                <TextField
                                    fullWidth
                                    className="inside-paper"
                                    placeholder="Número de tarifa"
                                    type="number"
                                    value={localFilters.tarifa || ''}
                                    onChange={(e) => handleChange('tarifa', Number(e.target.value))}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>
                        </Grid>

                        <Box display="flex" justifyContent="flex-end" gap={2} mt={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>
                            <Button variant="outlined" color="primary" sx={{ borderRadius: "6px", padding: "10px 20px" }}
                                onClick={handleClear}
                                disabled={Object.values(localFilters).every(value => !value || (Array.isArray(value) && value.length === 0))}
                            >Limpiar filtros</Button>
                            <Button variant="contained" color="primary" sx={{ borderRadius: "6px", padding: "10px 20px", boxShadow: "none", "&:hover": { boxShadow: "none", backgroundColor: "#C94715" } }}
                                onClick={handleApply}
                                disabled={Object.values(localFilters).every(value => !value || (Array.isArray(value) && value.length === 0))}
                            >Aplicar filtros</Button>
                        </Box>
                    </Paper>
                </Box>
            </Collapse>
        </Box>
    )
}
