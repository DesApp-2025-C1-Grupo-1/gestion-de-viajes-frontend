import { useWatch } from 'react-hook-form';
import { RemitoDto, useRemitosControllerGetRemitos } from '../../api/generated';
import { useEffect, useState } from 'react';

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
  const [remitosQuitados, setRemitosQuitados] = useState<RemitoDto[]>([]);
  // Watch del array de IDs desde el formulario
  const remitoIds = useWatch({ control, name: "remito_ids" }) || [];
  
/*   // Fetch de remitos completos por IDs
  const { data: remitosCompletosData } = useRemitosControllerGetRemitosByIds(
    { ids: remitoIds },
    { query: { enabled: remitoIds.length > 0 } }
  ); */
  
  useEffect(() => {
    
    const fetchRemitos = async () => {
      if (initialRemitoIds.length === 0) return;

      const promises = await Promise.all(
        initialRemitoIds.map(async (id) => {
          const response = await fetch(`https://remitos-backend.onrender.com/remito/${id}`);
          if (response.ok) {
            return response.json() as Promise<RemitoDto>;
          }
          return null;
        })
      );
      setRemitosCompletos(promises.filter((r): r is RemitoDto => r !== null));
    }

    fetchRemitos();
  }, [initialRemitoIds, setValue]);

  // Remitos seleccionados (objetos completos)
  const remitosSeleccionados = remitosCompletos || [] as RemitoDto[];

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
      ? remitoIds.filter((id : number) => id !== remitoId)
      : [...remitoIds, remitoId];

    setRemitosQuitados(prev => prev.filter(r => r.id !== remitoId));

    setRemitosCompletos(prev =>
      prev.find(r => r.id === remitoId)
        ? prev.filter(r => r.id !== remitoId)
        : [...prev, ...(remitosDisponibles.find(r => r.id === remitoId) ? [remitosDisponibles.find(r => r.id === remitoId)!] : [])]
    );
    
    setValue("remito_ids", nuevosIds, { shouldValidate: true });
  };

  const quitarRemito = (remito: RemitoDto) => {
    setValue("remito_ids", remitoIds.filter((id : number) => id !== remito.id), { shouldValidate: true });
    setRemitosCompletos(prev => prev.filter(r => r.id !== remito.id));
    setRemitosQuitados(prev => [...prev, remito]);
  };

  const restaurarRemito = (remito: RemitoDto) => {
    setValue("remito_ids", [...remitoIds, remito.id], { shouldValidate: true });
    setRemitosCompletos(prev => [...prev, remito]);
    setRemitosQuitados(prev => prev.filter(r => r.id !== remito.id));
  };

  const reordenarRemitos = (nuevosIds: number[]) => {
    setRemitosCompletos(prev => prev.sort((a, b) => nuevosIds.indexOf(a.id) - nuevosIds.indexOf(b.id)));
    setValue("remito_ids", nuevosIds, {
      shouldValidate: true,
      shouldDirty: true 
    });
  };

  return {
    remitosSeleccionados,
    remitosDisponibles,
    remitosCompletos,
    setRemitosCompletos,
    remitoIds,
    isLoading,
    toggleRemito,
    reordenarRemitos,
    quitarRemito,
    restaurarRemito,
    remitosQuitados
  };
};