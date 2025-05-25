import { useCallback, useState } from "react";
import { VehicleTypeDialog } from "../../components/vehicle/type-vehicle/VehicleTypeDialog";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { VehicleGrid } from "../../components/vehicle/type-vehicle/VehicleGrid";
import { EmptyState } from "../../components/EmptyState";
import  LoadingState  from "../../components/LoadingState";
import { SectionHeader } from "../../components/SectionHeader";
import { tipoVehiculoControllerCreate, tipoVehiculoControllerRemove, tipoVehiculoControllerUpdate, TipoVehiculoDto, useTipoVehiculoControllerFindAll } from "../../api/generated";
import { useNotify } from "../../hooks/useNotify";

export default function TypeVehicle() {
    const {notify} = useNotify("Tipo de vehículo");
    const {data, isLoading, refetch, error} = useTipoVehiculoControllerFindAll()
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingType, setEditingType] = useState<TipoVehiculoDto | null>(null);
    const [typeToDelete, setTypeToDelete] = useState<TipoVehiculoDto | null>(null);

    const vehicleTypes = data?.data || [];

    const handleOpenDialog = useCallback((vehicleType?: TipoVehiculoDto) => {
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

    const handleSubmit = useCallback(async (formData: Partial<TipoVehiculoDto>) => {
        try {
            if (editingType) {
                await tipoVehiculoControllerUpdate(editingType._id, formData);
            } else {
                if (formData.nombre) {
                    await tipoVehiculoControllerCreate({
                        nombre: formData.nombre,
                        descripcion: formData.descripcion || "",
                    });

                }
            }
            handleCloseDialog();
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
        await refetch();
    }, [editingType, handleCloseDialog]);

    const handleDeleteClick = useCallback((vehicleType: TipoVehiculoDto) => {
        setTypeToDelete(vehicleType);
    }, []);

    const confirmDelete = useCallback(async () => {
    if (!typeToDelete) return;
    try {
      await tipoVehiculoControllerRemove(typeToDelete._id);
      setTypeToDelete(null);
      await refetch();
    } catch (e) {
        const error = e as { response: { data: { message: string } } };
        if (error.response?.data?.message) {
            notify("error", error.response.data.message);
        }
    }
    }, [typeToDelete]);

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
                    <strong>{typeToDelete?.nombre}</strong>?
                </p>
                }
            />
    
        </>
    )
}