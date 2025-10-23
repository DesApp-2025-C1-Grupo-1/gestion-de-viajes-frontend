import { useTarifasControllerGetTarifaById } from "../../api/generated";
import { ViajeDistribucionDto } from "../../api/generated";

export function useTarifaDetails(trip?: ViajeDistribucionDto) {
  const tarifaId = trip?.tarifa_id;

  const { data, isLoading, isError } = useTarifasControllerGetTarifaById(
    tarifaId!,
    { query: { enabled: !!tarifaId } }
  );

  return {
    tarifa: data?.data ?? null,
    isLoading,
    isError,
  };
}