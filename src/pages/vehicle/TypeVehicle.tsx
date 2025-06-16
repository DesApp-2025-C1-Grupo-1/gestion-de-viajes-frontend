import { VehicleTypeDialog } from "../../components/vehicle/type-vehicle/VehicleTypeDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { VehicleGrid } from "../../components/vehicle/type-vehicle/VehicleGrid";
import { EmptyState } from "../../components/EmptyState";
import LoadingState from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { useTipoVehiculo } from "../../hooks/useVehicleTypeForm";
import { useCallback } from "react";
import { TipoVehiculoDto } from "../../api/generated";
import { CreateTipoVehiculoForm, UpdateTipoVehiculoForm } from "../../api/schemas";

export default function TypeVehicle() {
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


  return (
    <>
      <SectionHeader
        title="Tipos de vehículo"
        description="Defina las categorías de vehículos disponibles en el sistema."
        buttonText="Nuevo tipo"
        onAdd={() => openDialog()}
      />

      {isLoading ? (
        <LoadingState title="Tipos de vehículos" />
      ) : tiposVehiculo.length === 0 ? (
        <EmptyState onAdd={() => openDialog()} />
      ) : (
        <VehicleGrid
          vehicleTypes={tiposVehiculo}
          onEdit={openDialog}
          onDelete={handleDeleteClick}
        />
      )}

      <VehicleTypeDialog
        open={isDialogOpen}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        editingType={currentItem}
      />

      <ConfirmDialog
        open={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() =>  handleDelete(itemToDelete?._id || "")}
        title="Tipo de Vehículo"
        entityName={itemToDelete?.nombre || ""}
      />
    </>
  );
}
