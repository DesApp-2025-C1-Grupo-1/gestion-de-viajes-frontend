import { Box, Button, Chip, Collapse, Grid, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Funnel, ListFilter, X } from "lucide-react";
import { useCallback, useState } from "react";
import FilterTypeVehicle from "./vehicle/FilterTypeVehicle";
import FilterCompany from "./vehicle/FilterCompany";
import FilterVehicle from "./vehicle/FilterVehicle";

interface FilterSectionProps {
    filterOpen: boolean;
    setFilterOpen: (open: boolean) => void;
    formatChipLabel: (key: string, value: any) => string;
    onApply: (filters: Record<string, any>) => void;
    listFilters: { key: string; label: string; type: string; list?: { value: string}[] }[];
    typeVehicle?: boolean;
    chofer?: boolean;
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export default function FilterSection({
    filterOpen,
    setFilterOpen,
    onApply = () => {},
    formatChipLabel,
    listFilters,
    typeVehicle = false,
    chofer = false
}: FilterSectionProps) {
    const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
    const [localFilters, setLocalFilters] = useState<Record<string, any>>({});

    const handleChange = useCallback(
        (key: string, value: string | number | null) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
        },
        []
    );

    const handleApply = () => {
        const cleanFilters = Object.fromEntries(
        Object.entries(localFilters).filter(([_, v]) => v !== "" && v != null)
        );
        setAppliedFilters(cleanFilters);
        onApply(cleanFilters);
        setFilterOpen(false);
    };

    const handleClear = () => {
        setLocalFilters({});
        setAppliedFilters({});
        onApply({});
    };

    const handleDeleteChip = (key: string) => {
        const updated = { ...appliedFilters };
        delete updated[key];
        setAppliedFilters(updated);
        setLocalFilters(updated);
        onApply(updated);
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
                            onDelete={() => handleDeleteChip(key)}
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

                            {listFilters && listFilters.map((filter) => (
                                <Grid item xs={12} md={3} key={filter.key}>
                                    <Typography variant="subtitle2" color="#666" mb={0.5}>{filter.label}</Typography>
                                    {filter.type === "select" ? (
                                        <Select
                                            fullWidth
                                            className="inside-paper"
                                            displayEmpty
                                            value={localFilters[filter.key] ?? ""}
                                            onChange={(e) => handleChange(filter.key, e.target.value)}
                                        >
                                            <MenuItem value="">Todas</MenuItem>
                                            {filter.list?.map(option => (
                                                <MenuItem key={option.value} value={option.value}>{option.value}</MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        <TextField
                                            fullWidth
                                            className="inside-paper"
                                            placeholder={`Buscar por ${filter.label}`}
                                            value={localFilters[filter.key] ?? ""}
                                            onChange={(e) => handleChange(filter.key, e.target.value)}
                                            type={filter.type}
                                        />
                                    )}
                                </Grid>
                            ))}

                            {typeVehicle && 
                                <>
                                    <Grid item xs={12} md={3}>
                                        <Typography variant="subtitle2" color="#666" mb={0.5}>Tipo de vehículo</Typography>
                                        <FilterTypeVehicle localFilters={localFilters} handleChange={handleChange} />
                                    </Grid>
                                    <FilterCompany localFilters={localFilters} handleChange={handleChange} />
                                </>
                            }
                            {chofer && 
                                <>
                                    <FilterVehicle localFilters={localFilters} handleChange={handleChange} />
                                    <FilterCompany localFilters={localFilters} handleChange={handleChange} />
                                </>
                            }
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
                            >Aplicar filtros</Button>
                        </Box>
                    </Paper>
                </Box>
            </Collapse>
        </Box>
    );
}