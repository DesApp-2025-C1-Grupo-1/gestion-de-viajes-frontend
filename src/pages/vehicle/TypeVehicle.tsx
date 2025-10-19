import { VehicleTypeDialog } from "../../components/vehicle/type-vehicle/VehicleTypeDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { EmptyState } from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { useTipoVehiculo } from "../../hooks/useVehicleTypeForm";
import { useCallback, useEffect, useState } from "react";
import { TipoVehiculoDto } from "../../api/generated";
import { CreateTipoVehiculoForm, UpdateTipoVehiculoForm } from "../../api/schemas";
import SearchBar from "../../components/SearchBar";
import PaginationEntity from "../../components/PaginationEntity";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import CardVehicle from "../../components/vehicle/CardVehicle";

export default function TypeVehicle() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const debouncedQuery = useDebouncedValue(searchQuery, 500);

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
        description="Define las categorías de vehículos disponibles en el sistema."
        buttonText="Nuevo tipo"
        onAdd={() => openDialog()}
      />

      <SearchBar
        placeholder="Buscar por nombre"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {isLoading ? (
        <LoadingState title="Tipos de vehículos" />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4 px-0.5  lg:h-max">
          {paginated.map((vehicleType) => (
            <CardVehicle
              key={vehicleType._id}
              name={vehicleType.nombre}
              description={vehicleType.descripcion || ""}
              licenciaValida={vehicleType.licencia_permitida}
              handleEdit={() => openDialog(vehicleType)}
              handleDelete={() => handleDeleteClick(vehicleType)}
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      <PaginationEntity
          entity="vehículos"
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
