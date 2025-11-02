import { useCallback, useEffect, useState } from "react";
import { BuscarViajeDistribucionDto, ChoferDto, DepositoDto, EmpresaDto, RemitoDto, TarifaDto, VehiculoDto } from "../api/generated";
import { Stack, Button, Chip, Collapse, Paper, Typography, TextField, Select, MenuItem,Box, Grid, Autocomplete  } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Funnel, ListFilter, X } from "lucide-react";

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
    tarifas: TarifaDto[];
    loadingOptions: {
        empresas: boolean;
        vehiculos: boolean;
        choferes: boolean;
        depositos: boolean;
        remitos: boolean;
        tarifas: boolean;
    };
}

const hoy = new Date();
const haceUnMes = new Date();
haceUnMes.setMonth(hoy.getMonth() - 1);
haceUnMes.setHours(0, 0, 0, 0)

const estados = ["iniciado", "inicio de carga", "fin de carga", "fin de viaje"];

export default function DistributionFilters({
  filterOpen,
  setFilterOpen,
  onApply,
  initialFilters = {
    fecha_desde: haceUnMes.toISOString(),
    fecha_hasta: undefined,
    _id: "",
    transportista: "",
    chofer: "",
    vehiculo: "",
    tipo: undefined,
    origen: "",
    remito: [],
    tarifa: undefined,
    estado: "",
  },
  empresas,
  vehiculos,
  choferes,
  depositos,
  remitos,
  tarifas,
  loadingOptions,
}: TripFiltersProps) {
  const [localFilters, setLocalFilters] = useState<BuscarViajeDistribucionDto>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<BuscarViajeDistribucionDto>(initialFilters);
  const [remitoMap, setRemitoMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const map: Record<string, string> = {};
    remitos.forEach((r) => {
      map[r.id] = r.numeroAsignado;
    });
    setRemitoMap(map);
  }, [remitos]);

  // Cambios en filtros
  const handleChange = useCallback(
    (
      key: keyof BuscarViajeDistribucionDto,
      value: string | Date | number | number[] | null | undefined
    ) => {
      let adjustedValue: any = value;

      if (value instanceof Date) {
        const date = new Date(value);
        if (key === "fecha_desde") date.setHours(0, 0, 0, 0);
        if (key === "fecha_hasta") date.setHours(23, 59, 59, 999);
        adjustedValue = date.toISOString();
      }

      setLocalFilters((prev) => ({ ...prev, [key]: adjustedValue }));
    },
    []
  );

  const handleApply = () => {
      setAppliedFilters(localFilters);
      onApply(localFilters);
      setFilterOpen(false);
  };

  const handleClear = () => {
    const empty: BuscarViajeDistribucionDto = {
      fecha_desde: haceUnMes.toISOString(),
      fecha_hasta: undefined,
      _id: "",
      transportista: "",
      chofer: "",
      vehiculo: "",
      tipo: undefined,
      origen: "",
      remito: [],
      tarifa: undefined,
      estado: "",
    };
    setLocalFilters(empty);
    setAppliedFilters(empty);
    onApply(empty);
  };

  const handleDeleteChip = (key: keyof BuscarViajeDistribucionDto) => {
    const clearedValue =
      key === "tipo" || key === "fecha_desde" || key === "fecha_hasta"
        ? undefined
        : key === "remito"
        ? []
        : "";
    const updatedFilters = { ...appliedFilters, [key]: clearedValue };
    setAppliedFilters(updatedFilters);
    setLocalFilters(updatedFilters);
    onApply(updatedFilters);
  };

  // Helpers para mostrar chips
  const nameEmpresaChip = (id: string) =>
    empresas.find((e) => e._id === id)?.nombre_comercial || "Empresa no encontrada";
  const nameVehiculoChip = (id: string) =>
    vehiculos.find((v) => v._id === id)
      ? `${vehiculos.find((v) => v._id === id)!.modelo} - ${
          vehiculos.find((v) => v._id === id)!.patente
        }`
      : "Vehículo no encontrado";
  const nameChoferChip = (id: string) =>
    choferes.find((c) => c._id === id)
      ? `${choferes.find((c) => c._id === id)!.nombre} ${
          choferes.find((c) => c._id === id)!.apellido
        }`
      : "Chofer no encontrado";
  const nameDepositoChip = (id: string) =>
    depositos.find((d) => d._id === id)?.nombre || "Depósito no encontrado";

  const formatChipLabel = (key: string, value: any) => {
    switch (key) {
      case "fecha_desde":
        return `Desde: ${new Date(value).toLocaleDateString()}`;
      case "fecha_hasta":
        return `Hasta: ${new Date(value).toLocaleDateString()}`;
      case "_id":
        return `N° Viaje: ${value}`;
      case "transportista":
        return `Transportista: ${nameEmpresaChip(value)}`;
      case "vehiculo":
        return `Vehículo: ${nameVehiculoChip(value)}`;
      case "chofer":
        return `Chofer: ${nameChoferChip(value)}`;
      case "origen":
        return `Origen: ${nameDepositoChip(value)}`;
      case "tipo":
        return `Tipo: ${value}`;
      case "remito":
        // Usar remitoMap para mostrar numeroAsignado
        return `Remitos: ${value
          .map((id: string) => remitoMap[id] || id)
          .join(", ")}`;
      case "tarifa":
        return `Tarifa: ${value}`;
      case "estado":
        return `Estado: ${value}`;
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
          <Paper elevation={3} sx={{ p: 2.5, backgroundColor: "white", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "1px solid #c7c7c7" }}>
            <Grid container spacing={2} sx={{ color: "#5A5A65" }}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Rango de fechas</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: "inside-paper",
                          placeholder: "Desde",
                          size: "small",
                        },
                      }}
                      format="dd/MM/yyyy"
                      value={
                        localFilters.fecha_desde
                          ? new Date(localFilters.fecha_desde)
                          : null
                      }
                      onChange={(value) => handleChange("fecha_desde", value)}
                      sx={{ flex: 1 }}
                    />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Rango de fechas</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: "inside-paper",
                        placeholder: "Hasta",
                        size: "small",
                      },
                    }}
                    format="dd/MM/yyyy"
                    value={
                      localFilters.fecha_hasta
                        ? new Date(localFilters.fecha_hasta)
                        : null
                    }
                    onChange={(value) => handleChange("fecha_hasta", value)}
                    sx={{ flex: 1 }}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Número de viaje</Typography>
                <TextField
                    fullWidth
                    className="inside-paper"
                    placeholder="Buscar por ID de viaje"
                    value={localFilters._id}
                    onChange={(e) => handleChange('_id', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="#666" mb={0.5}>Transportista</Typography>
                  <Select
                      fullWidth
                      value={localFilters.transportista}
                      onChange={(e) => handleChange('transportista', e.target.value)}
                      displayEmpty
                  >
                      <MenuItem value="" disabled>{loadingOptions.empresas ? "Cargando..." : "Seleccionar transportista"}</MenuItem>
                      {empresas.map(emp => (<MenuItem key={emp._id} value={emp._id}>{emp.nombre_comercial}</MenuItem>))}
                  </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="#666" mb={0.5}>Vehículo</Typography>
                  <Select
                      fullWidth
                      value={localFilters.vehiculo}
                      onChange={(e) => handleChange('vehiculo', e.target.value)}
                      displayEmpty
                  >
                      <MenuItem value="" disabled>{loadingOptions.vehiculos ? "Cargando..." : "Seleccionar vehículo"}</MenuItem>
                      {vehiculos.map(veh => (<MenuItem key={veh._id} value={veh._id}>{veh.modelo} - {veh.patente}</MenuItem>))}
                  </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="#666" mb={0.5}>Chofer</Typography>
                  <Select
                      fullWidth
                      value={localFilters.chofer}
                      onChange={(e) => handleChange('chofer', e.target.value)}
                      displayEmpty
                  >
                      <MenuItem value="" disabled>{loadingOptions.choferes ? "Cargando..." : "Seleccionar chofer"}</MenuItem>
                      {choferes.map(c => (<MenuItem key={c._id} value={c._id}>{c.nombre} {c.apellido}</MenuItem>))}
                  </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="#666" mb={0.5}>Estado de viaje</Typography>
                  <Select
                      fullWidth
                      value={localFilters.estado}
                      onChange={(e) => handleChange('estado', e.target.value)}
                      displayEmpty
                  >
                      <MenuItem value="" disabled>{loadingOptions.choferes ? "Cargando..." : "Seleccionar estado"}</MenuItem>
                      {estados.map((estado,index) => (<MenuItem key={index} value={estado}>{estado[0].toUpperCase() + estado.slice(1)}</MenuItem>))}
                  </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="#666" mb={0.5}>Depósito de origen</Typography>
                  <Select
                      fullWidth
                      value={localFilters.origen}
                      onChange={(e) => handleChange('origen', e.target.value)}
                      displayEmpty
                  >
                      <MenuItem value="" disabled>{loadingOptions.depositos ? "Cargando..." : "Seleccionar depósito"}</MenuItem>
                      {depositos.map(d => (<MenuItem key={d._id} value={d._id}>{d.nombre}</MenuItem>))}
                  </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Tipo de viaje</Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflow: "hidden",
                  }}
                >
                  <Button
                    variant="outlined"
                    disableElevation
                    fullWidth
                    sx={{
                      borderRadius: "6px", textTransform: "none", minWidth: "72px", padding: "10px 32px",
                      backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : 'white',
                      color: localFilters.tipo === 'nacional' ? 'white' : '#5A5A65',
                      "&:hover": { backgroundColor: localFilters.tipo === 'nacional' ? '#C94715' : '#f5f5f5', boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }
                    }}
                    onClick={() => handleChange('tipo', localFilters.tipo === 'nacional' ? undefined : 'nacional')}
                  >Nacional</Button>
                  <Button
                    variant="outlined"
                    disableElevation
                    fullWidth
                    sx={{
                        borderRadius: "6px", textTransform: "none",padding: "10px 32px", minWidth: "100px",
                        backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : 'white',
                        color: localFilters.tipo === 'internacional' ? 'white' : '#5A5A65',
                        "&:hover": { backgroundColor: localFilters.tipo === 'internacional' ? '#C94715' : '#f5f5f5', boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }
                    }}
                    onClick={() => handleChange('tipo', localFilters.tipo === 'internacional' ? undefined : 'internacional')}
                  >Internacional</Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Remito</Typography>
                <Select
                  fullWidth
                  multiple
                  value={localFilters.remito || []}
                  onChange={(e) => {
                    const value = e.target.value as string[];
                    const ids = value.map((v) => Number(v));
                    handleChange("remito", ids);
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (loadingOptions.remitos) return "Cargando...";
                    if (!selected || selected.length === 0) return "Seleccionar remitos";

                    // Mostrar numeroAsignado en el chip
                    return selected
                      .map((id) => remitos.find((r) => r.id === Number(id))?.numeroAsignado || id)
                      .join(", ");
                  }}
                >
                  {loadingOptions.remitos ? (
                    <MenuItem disabled>Cargando...</MenuItem>
                  ) : (
                    remitos.map((rem) => (
                      <MenuItem key={rem.id} value={rem.id}>
                        {rem.numeroAsignado}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="#666" mb={0.5}>Tarifa</Typography>
                <Autocomplete
                  disablePortal
                  id="tarifa-autocomplete"
                  options={tarifas}
                  loading={loadingOptions.tarifas}
                  noOptionsText="No hay tarifas disponibles"
                  getOptionLabel={(option) => option?.nombreTarifa ?? ""}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={
                    localFilters.tarifa
                      ? tarifas.find((t) => t.id === localFilters.tarifa) || null
                      : null
                  }
                  onChange={(event, newValue) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      tarifa: newValue ? newValue.id : undefined,
                    }))
                  }
                  filterOptions={(options, { inputValue }) =>
                    options.filter((option) =>
                      option.nombreTarifa
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        loadingOptions.tarifas ? "Cargando tarifas..." : "Seleccionar tarifa"
                      }
                      size="small"
                      fullWidth
                      className="inside-paper"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box 
              display="flex" mt={2} 
              sx={{ flexDirection: { xs: "column", sm: "row" }, justifyContent: { xs: "flex-start", md: "flex-end" }, gap: 1, 
              borderTop: "1px solid #EAEAEA", pt: 2 }}
            >
              <Button variant="outlined" color="primary" 
                startIcon={<X size={16} />}
                sx={{ borderRadius: "8px",
                  padding: "10px 20px",
                  textTransform: "none",
                  borderColor: "#D0D0D5",
                  color: "#5A5A65",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  "&:hover": {
                    backgroundColor: "#F6F6F8",
                    borderColor: "#B0B0B0",
                  },
                  width: { xs: "100%", md: "auto"}
                }}
                onClick={handleClear}
                disabled={Object.values(localFilters).every(value => !value || (Array.isArray(value) && value.length === 0))}
              >Limpiar filtros</Button>
              <Button variant="text" color="primary" 
                startIcon={<Funnel size={16} />}
                sx={{
                  borderRadius: "8px",
                  padding: "10px 20px",
                  textTransform: "none",
                  backgroundColor: "#E65F2B",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: "#C94715",
                    boxShadow: "none",
                  },
                  width: { xs: "100%", md: "auto"}
                }}
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
