import { useCallback, useState } from "react";
import { VehicleType } from "../../types";
import { useVehicleTypes } from "../../hooks/useVehicleTypes";
import { VehicleTypeDialog } from "../../components/vehicle/type-vehicle/VehicleTypeDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { VehicleGrid } from "../../components/vehicle/type-vehicle/VehicleGrid";
import { EmptyState } from "../../components/EmptyState";
import  LoadingState  from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";

export default function TypeVehicle() {

    const {
        vehicleTypes,
        isLoading,
        addVehicleType,
        editVehicleType,
        removeVehicleType
    } = useVehicleTypes();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<VehicleType | null>(null);
    const [typeToDelete, setTypeToDelete] = useState<VehicleType | null>(null);

    const handleOpenDialog = useCallback((vehicleType?: VehicleType) => {
        if (vehicleType) {
        setEditingType(vehicleType);
        } else {
        setEditingType(null);
        }
        setIsDialogOpen(true);
    }, []);

    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false);
        setEditingType(null);
    }, []);

    const handleSubmit = useCallback(async (formData: Partial<VehicleType>) => {
        try {
        if (editingType) {
            await editVehicleType(editingType._id, formData);
        } else {
            await addVehicleType(formData);
        }
        handleCloseDialog();
        } catch (error) {
        console.error("Error saving vehicle type:", error);
        }
    }, [editingType, editVehicleType, addVehicleType, handleCloseDialog]);

    const handleDeleteClick = useCallback((vehicleType: VehicleType) => {
        setTypeToDelete(vehicleType);
    }, []);

    const confirmDelete = useCallback(async () => {
    if (!typeToDelete) return;
    try {
      await removeVehicleType(typeToDelete._id);
      setTypeToDelete(null);
    } catch (error) {
      console.error("Error deleting vehicle type:", error);
    }
    }, [typeToDelete, removeVehicleType]);

    const closeConfirmDialog = useCallback(() => {
        setTypeToDelete(null);
    }, []);

    const handleAddNew = useCallback(() => handleOpenDialog(), [handleOpenDialog]);

    return(
        <>
            <SectionHeader
                title="Tipos de Vehículo"
                description="Gestione los tipos de vehículos disponibles en el sistema"
                buttonText="Nuevo tipo"
                onAdd={handleAddNew}
            />

            {isLoading ? (
                <LoadingState title="tipos de vehículos" />
            ) : vehicleTypes.length === 0 ? (
                <EmptyState onAdd={handleAddNew} />
            ) : (
                <VehicleGrid
                    vehicleTypes={vehicleTypes}
                    onEdit={handleOpenDialog}
                    onDelete={handleDeleteClick}
                />
            )}
            
            <VehicleTypeDialog 
                open={isDialogOpen} 
                onClose={handleCloseDialog}  
                onSubmit={handleSubmit} 
                editingType={editingType}
            />
            <ConfirmDialog
                open={!!typeToDelete}
                onClose={closeConfirmDialog}
                onConfirm={confirmDelete}
                title="Confirmar eliminación"
                content={
                <p>
                    ¿Estás seguro que deseas eliminar el tipo de vehículo{" "}
                    <strong>{typeToDelete?.name}</strong>?
                </p>
                }
            />
    
        </>
    )
}