import { useWatch } from 'react-hook-form';
import { RemitoDto, remitosControllerGetRemitosByIds, useRemitosControllerGetRemitos, useRemitosControllerGetRemitosByIds } from '../../api/generated';
import { useEffect, useState } from 'react';
import { UseRemitosManagementProps } from '../../types';

export const useRemitosManagement = ({
  control,
  setValue,
  initialRemitoIds = [],
  selectedProvincia,
  selectedLocalidad
}: UseRemitosManagementProps) => {

  const [remitosCompletos, setRemitosCompletos] = useState<RemitoDto[]>([]);
  const [remitosQuitados, setRemitosQuitados] = useState<RemitoDto[]>([]);
  const remitoIds = useWatch({ control, name: "remito_ids" }) || [];

  useEffect(() => {
    if (initialRemitoIds.length === 0) return;

    (async () => {
      const { data } = await remitosControllerGetRemitosByIds({ ids: initialRemitoIds });
      setRemitosCompletos(data || []);
    })();
  }, [initialRemitoIds]);


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

  const toggleRemito = (remitoId: number) => {
    const nuevosIds = remitoIds.includes(remitoId)
      ? remitoIds.filter((id: number) => id !== remitoId)
      : [...remitoIds, remitoId];

    setRemitosQuitados(prev => prev.filter(r => r.id !== remitoId));

    setRemitosCompletos(prev =>
      prev.find(r => r.id === remitoId)
        ? prev.filter(r => r.id !== remitoId)
        : [
            ...prev,
            ...(remitosDisponibles.find(r => r.id === remitoId)
              ? [remitosDisponibles.find(r => r.id === remitoId)!]
              : []),
          ]
    );

    setValue("remito_ids", nuevosIds, { shouldValidate: true });
  };

  const toggleRemitos = (remitoIdsToToggle: number[]) => {
    if (remitoIdsToToggle.length === 0) return;

    // Determinar qué IDs agregar y cuáles remover
    const idsToAdd = remitoIdsToToggle.filter(id => !remitoIds.includes(id));
    const idsToRemove = remitoIdsToToggle.filter(id => remitoIds.includes(id));

    // Calcular nuevos IDs
    const nuevosIds = [
      ...remitoIds.filter((id : number )=> !idsToRemove.includes(id)),
      ...idsToAdd
    ];

    // Actualizar remitos completos
    setRemitosCompletos(prev => {
      // Remover los que hay que quitar
      let updated = prev.filter(remito => !idsToRemove.includes(remito.id));
      
      // Agregar los nuevos desde disponibles
      const nuevosRemitos = remitosDisponibles.filter(
        remito => idsToAdd.includes(remito.id) && !updated.some(r => r.id === remito.id)
      );
      
      return [...updated, ...nuevosRemitos];
    });

    // Actualizar remitos quitados
    setRemitosQuitados(prev => prev.filter(remito => !idsToAdd.includes(remito.id)));

    // Actualizar formulario
    setValue("remito_ids", nuevosIds, { shouldValidate: true });
  };

  const quitarRemito = (remito: RemitoDto) => {
    setValue("remito_ids", remitoIds.filter((id: number) => id !== remito.id), { shouldValidate: true });
    setRemitosCompletos(prev => prev.filter(r => r.id !== remito.id));
    setRemitosQuitados(prev => [...prev, remito]);
  };

  const restaurarRemito = (remito: RemitoDto) => {
    setValue("remito_ids", [...remitoIds, remito.id], { shouldValidate: true });
    setRemitosCompletos(prev => [...prev, remito]);
    setRemitosQuitados(prev => prev.filter(r => r.id !== remito.id));
  };
  
  const reordenarRemitos = (nuevosIds: number[]) => {
    // Reordenar el array completo basado en el nuevo orden de IDs
    const nuevosRemitosOrdenados = [...remitosCompletos].sort(
      (a, b) => nuevosIds.indexOf(a.id) - nuevosIds.indexOf(b.id)
    );
    
    setRemitosCompletos(nuevosRemitosOrdenados);
    setValue("remito_ids", nuevosIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const refrescarRemitos = async () => {
    if (remitoIds.length === 0) return;
    const { data } = await remitosControllerGetRemitosByIds({ ids: remitoIds });
    setRemitosCompletos(data || []);
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
    toggleRemitos,
    remitosQuitados,
    refrescarRemitos,
  };
};