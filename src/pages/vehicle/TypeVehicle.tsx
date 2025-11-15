import { VehicleTypeDialog } from "../../components/vehicle/type-vehicle/VehicleTypeDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import LoadingState from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { useTipoVehiculo } from "../../hooks/useVehicleTypeForm";
import { useCallback, useEffect, useState } from "react";
import { TipoVehiculoDto } from "../../api/generated";
import { CreateTipoVehiculoForm, UpdateTipoVehiculoForm } from "../../api/schemas";
import SearchBar from "../../components/SearchBar";
import PaginationEntity from "../../components/PaginationEntity";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import EntityCard from "../../components/EntityCard";
import { Eye, Truck } from "lucide-react";
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import LicenseValidate from "../../components/vehicle/type-vehicle/LicenseValidate";
import MenuItem from "../../components/buttons/MenuItem";
import FilterSection, { getNestedValue } from "../../components/FilterSection";
import { tipoLicenciaSchema } from "../../api/schemas/enums/tipoLicencia.schema";

export default function TypeVehicle() {
  const [page, setPage] = useState<number>(1);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const defaultRows = isMobile ? 5 : isTablet ? 8 : 5;
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRows);
  const {
    tiposVehiculo,
    isLoading,
    isDialogOpen,
    currentItem,
    itemToDelete,
    openDialog,
    closeDialog,
    handleCreate,
    handleUpdate,
    handleDelete,
    setItemToDelete,
  } = useTipoVehiculo();
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [filteredVehicles, setFilteredVehicles] = useState<TipoVehiculoDto[]>([]);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const handleSubmit = (formData: UpdateTipoVehiculoForm | CreateTipoVehiculoForm) => {
    if (currentItem?._id) {
      handleUpdate(currentItem._id, formData as UpdateTipoVehiculoForm);
    } else {
      handleCreate(formData as CreateTipoVehiculoForm);
    }
  };

  const handleDeleteClick = useCallback((vehicleType: TipoVehiculoDto) => {
        setItemToDelete(vehicleType);
    }, []);

    const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage);
    const paginated = filteredVehicles.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
  
    const formatChipLabel = (key: string, value: any) => {
        switch (key) {
            case "nombre":
                return `Nombre: ${value}`;
            case "descripcion":
                return `Descripción: ${value}`;
            case "licencia_permitida":
                return `Licencia Permitida: ${value}`;
            default:
                return `${key}: ${value}`;
        }
    };

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setPage(1);
    };
    
    // Filtrado dinámico según los filtros aplicados
    useEffect(() => {
        if (!tiposVehiculo) return;

        let result = tiposVehiculo;

        Object.entries(appliedFilters).forEach(([key, value]) => {
            if (!value) return;

            result = result.filter((d) => {
            const fieldValue = getNestedValue(d, key);
            if (typeof fieldValue === "string") {
                return fieldValue.toLowerCase().includes((value as string).toLowerCase());
            }
            if (typeof fieldValue === "number") {
                return fieldValue.toString().includes((value as number).toString());
            }
            return fieldValue === value;
            });
        });

        setFilteredVehicles(result);
    }, [appliedFilters, tiposVehiculo]);

  return (
    <>
      <SectionHeader
        title="Tipos de vehículo"
        buttonText="Nuevo tipo"
        onAdd={() => openDialog()}
      />

      <FilterSection
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        onApply={handleApplyFilters}
        formatChipLabel={formatChipLabel}
        listFilters={[
          { key: "nombre", label: "Nombre", type: "text" },
          { key: "descripcion", label: "Descripción", type: "text" },
          { key: "licencia_permitida", label: "Licencia Permitida", type: "select", list: tipoLicenciaSchema.options.map(lic => ({ value: lic })) },
        ]}
      />

      {isTablet || isMobile ? (
        <Grid >
          {isLoading ? (
            <LoadingState title="Tipos de vehículos" />
          ) : filteredVehicles.length === 0 ? (
            <Box className="text-center text-gray-500 py-5">
              No se encontraron tipos de vehículos.
            </Box>
          ) : (
            <Grid container spacing={2}>
              {paginated.map((vehicleType) => (
                <Grid item xs={12} md={6} lg={4} key={vehicleType._id} >
                  <EntityCard
                    icon={<Truck />}
                    title={vehicleType.nombre}
                    onEdit={() => openDialog(vehicleType)}
                    onDelete={() => handleDeleteClick(vehicleType)}
                    fields={[
                      {
                        label: "Descripción",
                        value: vehicleType.descripcion || "-",
                        extend: true,
                      },
                    ]}
                    licenseType={vehicleType.licencia_permitida}
                  />
                </Grid>
              ))}
            </Grid>

          )}
        </Grid>
      ) : (
        <Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell align="center" sx={{width: 180}}>Licencia Permitida</TableCell>
                  <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow key="loading">
                    <TableCell colSpan={7} >
                        <LoadingState title="tipo de vehículos"/>
                    </TableCell>
                </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow key="no-trips" hover>
                    <TableCell
                        colSpan={6}
                        sx={{textAlign: "center", paddingY: "26px",}}
                    >
                        No se encontraron tipos de vehículos
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map(typeVehicle => (
                    <TableRow key={typeVehicle._id} hover>
                      <TableCell sx={{fontWeight: "bold"}}>{typeVehicle.nombre}</TableCell>
                      <TableCell>{typeVehicle.descripcion}</TableCell>
                      <TableCell align="center">
                        <LicenseValidate licenseType={typeVehicle.licencia_permitida} />
                      </TableCell>
                      <TableCell>
                        <MenuItem  
                          id={typeVehicle._id}
                          handleOpenDialog={() => handleDeleteClick(typeVehicle)}
                          handleEditModal={() => openDialog(typeVehicle)}
                        >
                          <Eye className="text-gray-500 hover:text-gray-700 size-4" />
                        </MenuItem>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      

      {/* Paginación */}
      <PaginationEntity
          entity="tipos de vehículos"
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          filtered={filteredVehicles}
          handleChangePage={handleChangePage}
          setRowsPerPage={setRowsPerPage}
          setPage={setPage}
      />

      <VehicleTypeDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        editingType={currentItem}
      />

      <ConfirmDialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        genre="el"
        onConfirm={() =>  handleDelete(itemToDelete?._id || "")}
        title="Tipo de Vehículo"
        entityName={itemToDelete?.nombre || ""}
      />
    </>
  );
}
