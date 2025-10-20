import { useEffect } from "react";
import { useRemitosControllerGetRemitosByIds } from "../../api/generated";
import { ViajeDistribucionDto } from "../../api/generated";

export function useRemitosDetails(trip?: ViajeDistribucionDto) {

  const remitoIds = trip?.remito_ids;

  const mutation = useRemitosControllerGetRemitosByIds();

  useEffect(() => {
    if (remitoIds?.length) {
      mutation.mutate(
        { data: { ids: remitoIds } },
        {
          onError: () => {
            console.error("Error al obtener los remitos asociados al viaje.");
          },
        }
      );
    }
  }, [remitoIds]);

  return {
    remitos: Array.isArray(mutation.data?.data) ? mutation.data.data : [],
    isLoading: mutation.isPending,
    isError: mutation.isError,
  };
}