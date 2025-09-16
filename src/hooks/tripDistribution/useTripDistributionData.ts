import { useEffect } from "react";
import { useViajeDistribucionControllerFindOne } from "../../api/generated";

export const useTripDistributionData = (id?: string, reset?: (data: any) => void) => {
  const isEditing = !!id;
  const { data, isLoading, error } = useViajeDistribucionControllerFindOne(id!, { query: { enabled: isEditing } });

  useEffect(() => {
    if (isEditing && data?.data && reset) {
      const viaje = data.data;
      reset({
        ...viaje,
        fecha_inicio: viaje.fecha_inicio ? new Date(viaje.fecha_inicio) : undefined,
        origen: viaje.origen._id,
        vehiculo: viaje.vehiculo._id,
        transportista: viaje.transportista._id,
        chofer: viaje.chofer._id,
        remitos: viaje.remito_ids || [],
        kilometros_camion: viaje.kilometros ?? 0,
        remito_ids: viaje.remito_ids ?? [],
        kilometros: viaje.kilometros ?? 0,
        tarifa_id: viaje.tarifa_id,
        estado: viaje.estado,
      });
    }
  }, [data, isEditing, reset]);

  return { isEditing, data, isLoading, error};
};
