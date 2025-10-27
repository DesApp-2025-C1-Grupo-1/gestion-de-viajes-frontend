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

export default function TypeVehicle() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedQuery = useDebouncedValue(searchQuery, 500);
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

    const filtered = tiposVehiculo.filter((v) =>
        v.nombre.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };
  

    useEffect(() => {
        // Si el search cambia, reseteamos a página 1
        setPage(1);
    }, [searchQuery]);


  return (
    <>
      <SectionHeader
        title="Tipos de vehículo"
        buttonText="Nuevo tipo"
        onAdd={() => openDialog()}
      />

      <SearchBar
        placeholder="Buscar por nombre"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      {isTablet || isMobile ? (
        <Grid>
          {isLoading ? (
            <LoadingState title="Tipos de vehículos" />
          ) : filtered.length === 0 ? (
            <Box className="text-center text-gray-500 py-5">
              No se encontraron tipos de vehículos.
            </Box>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5  lg:h-max">
              {paginated.map((vehicleType) => (
                <EntityCard
                  key={vehicleType._id}
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
              ))}
            </div>
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
          filtered={filtered}
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
