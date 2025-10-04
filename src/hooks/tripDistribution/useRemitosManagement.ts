import { useWatch } from 'react-hook-form';
import { RemitoDto, useRemitosControllerGetRemitos } from '../../api/generated';
import { useState } from 'react';

interface UseRemitosManagementProps {
  control: any;
  setValue: any;
  initialRemitoIds?: number[];
  selectedProvincia?: any;
  selectedLocalidad?: any;
}

export const useRemitosManagement = ({
  control,
  setValue,
  initialRemitoIds = [],
  selectedProvincia,
  selectedLocalidad
}: UseRemitosManagementProps) => {

  const [remitosCompletos, setRemitosCompletos] = useState<RemitoDto[]>([]);
  // Watch del array de IDs desde el formulario
  const remitoIds = useWatch({ control, name: "remito_ids" }) || [];
  
/*   // Fetch de remitos completos por IDs
  const { data: remitosCompletosData } = useRemitosControllerGetRemitosByIds(
    { ids: remitoIds },
    { query: { enabled: remitoIds.length > 0 } }
  ); */

  // Remitos seleccionados (objetos completos)
  const remitosSeleccionados = /* remitosCompletosData?.data || */ [] as RemitoDto[];

  // Remitos disponibles para la ubicación seleccionada
  const { data: remitosDisponiblesData, isLoading } = useRemitosControllerGetRemitos(
    {
      provincia: selectedProvincia?.nombre,
      localidad: selectedLocalidad?.nombre,
      estadoId: 2,
    },
    { query: { enabled: !!selectedProvincia } }
  );

  const remitosDisponibles = remitosDisponiblesData?.data?.data || [];

  // Función para agregar/remover remitos
  const toggleRemito = (remitoId: number) => {
    const nuevosIds = remitoIds.includes(remitoId)
      ? remitoIds.filter(id => id !== remitoId)
      : [...remitoIds, remitoId];

    setRemitosCompletos(prev =>
      prev.find(r => r.id === remitoId)
        ? prev.filter(r => r.id !== remitoId)
        : [...prev, ...(remitosDisponibles.find(r => r.id === remitoId) ? [remitosDisponibles.find(r => r.id === remitoId)!] : [])]
    );
    
    setValue("remito_ids", nuevosIds, { shouldValidate: true });
  };

  // Función para reordenar (preparación para drag & drop)
  const reordenarRemitos = (desdeIndex: number, hastaIndex: number) => {
    const nuevosIds = [...remitoIds];
    const [removido] = nuevosIds.splice(desdeIndex, 1);
    nuevosIds.splice(hastaIndex, 0, removido);
    setValue("remito_ids", nuevosIds, { shouldValidate: true });
  };

  return {
    remitosSeleccionados,
    remitosDisponibles,
    remitosCompletos,
    setRemitosCompletos,
    remitoIds,
    isLoading,
    toggleRemito,
    reordenarRemitos
  };
};