import { useEffect, useState } from "react";
import { RemitoDto, ViajeDistribucionDto, remitosControllerGetRemitosByIds } from "../../api/generated";
import { useNotify } from "../useNotify";
import axios from "axios";

export function useRemitosFromTrip(trip: ViajeDistribucionDto | undefined) {
  const notify = useNotify();
  const [remitos, setRemitos] = useState<RemitoDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!trip?.remito_ids?.length) return;

    const fetchRemitos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post("/remito/by-id", { ids: trip.remito_ids });
        const remitosObtenidos = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];

        setRemitos(remitosObtenidos);
      } catch (error: any) {
        console.error("Error al obtener los remitos asociados al viaje.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRemitos();
  }, [trip?.remito_ids]);

  return { remitos, isLoading };
}

