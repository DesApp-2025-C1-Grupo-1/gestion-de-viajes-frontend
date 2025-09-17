import { useCallback, useState } from "react";
import { useNotify } from "./useNotify";
import {
  tipoVehiculoControllerCreate,
  tipoVehiculoControllerRemove,
  tipoVehiculoControllerUpdate,
  useTipoVehiculoControllerFindAll
} from "../api/generated";
import { CreateTipoVehiculoForm, TipoVehiculoForm, UpdateTipoVehiculoForm } from "../api/schemas";

export const useTipoVehiculo = () => {
  const { notify } = useNotify("Tipo de vehículo", "male");
  const { data, isLoading, refetch } = useTipoVehiculoControllerFindAll();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<TipoVehiculoForm | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TipoVehiculoForm | null>(null);

  const tiposVehiculo = data?.data || [];

  const openDialog = useCallback((item?: TipoVehiculoForm) => {
    setCurrentItem(item || null);
    setIsDialogOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsDialogOpen(false);
    setTimeout(() => setCurrentItem(null), 300);
  }, []);

  const handleCreate = useCallback(async (formData: CreateTipoVehiculoForm) => {
    try {
      // Asegurar que descripcion no sea undefined
      const dataToSend = {
        nombre: formData.nombre,
        descripcion: formData.descripcion || "",
        licencia_permitida: formData.licencia_permitida,
      };
      await tipoVehiculoControllerCreate(dataToSend);
      notify("create");
      closeDialog();
      await refetch();
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      if (error.response?.data?.message) {
          notify("error", error.response.data.message);
      }
    }
  }, [notify, closeDialog, refetch]);

  const handleUpdate = useCallback(async (id: string, formData: UpdateTipoVehiculoForm) => {
    try {
      // Filtrar campos undefined y mantener solo los que se modificaron
      const dataToSend = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined)
      );
      await tipoVehiculoControllerUpdate(id, dataToSend);
      notify("update");
      closeDialog();
      await refetch();
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      if (error.response?.data?.message) {
          notify("error", error.response.data.message);
      }
    }
  }, [notify, closeDialog, refetch]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await tipoVehiculoControllerRemove(id);
      notify("delete");
      setItemToDelete(null);
      await refetch();
    } catch (e) {
      const error = e as { response: { data: { message: string } } };
      if (error.response?.data?.message) {
          notify("error", error.response.data.message);
      }
    }
  }, [notify, refetch]);

  return {
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
    setItemToDelete
  };
};