import { useEffect } from "react";
import { useViajeControllerFindOne } from "../../api/generated";

export const useTripData = (id?: string, reset?: (data: any) => void) => {
  const isEditing = !!id;
  const { data, isLoading, error } = useViajeControllerFindOne(id!, { query: { enabled: isEditing } });

  useEffect(() => {
    if (isEditing && data?.data && reset) {
      const viaje = data.data;
      reset({
        ...viaje,
        fecha_inicio: viaje.fecha_inicio ? new Date(viaje.fecha_inicio) : undefined,
        fecha_llegada: viaje.fecha_llegada ? new Date(viaje.fecha_llegada) : undefined,
        deposito_origen: viaje.deposito_origen._id,
        deposito_destino: viaje.deposito_destino._id,
        vehiculo: viaje.vehiculo._id,
        empresa: viaje.empresa._id,
        chofer: viaje.chofer._id,
      });
    }
  }, [data, isEditing, reset]);

  return { isEditing, data, isLoading, error };
};
