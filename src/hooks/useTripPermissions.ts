import { useMemo } from 'react';

export type TripEstado = 'iniciado' | 'inicio de carga' | 'fin de carga' | 'fin de viaje';

export interface TripPermissions {
  // Edición de datos básicos
  canEditChofer: boolean;
  canEditVehiculo: boolean;
  canEditTransportista: boolean;
  canEditRemitos: boolean;
  canEditOrigen: boolean;
  canEditFechaInicio: boolean;
  canEditKilometrosIniciales: boolean;
  canEditKilometrosFinales: boolean;
  
  // Gestión de estados
  canChangeRemitosState: boolean;
  canFinalizeTrip: boolean;
  canChangeTripState: boolean;
  
  // Niveles de acceso
  canEditTrip: boolean;
  canManageTrip: boolean;
  
  // Estados específicos
  isIniciado: boolean;
  isInicioCarga: boolean;
  isFinCarga: boolean;
  isFinViaje: boolean;
}

export const useTripPermissions = (estado: TripEstado): TripPermissions => {
  return useMemo(() => {
    const isIniciado = estado === 'iniciado';
    const isInicioCarga = estado === 'inicio de carga';
    const isFinCarga = estado === 'fin de carga';
    const isFinViaje = estado === 'fin de viaje';

    return {
      // Edición de datos básicos - Solo en estado "iniciado"
      canEditChofer: isIniciado,
      canEditVehiculo: isIniciado,
      canEditTransportista: isIniciado,
      canEditRemitos: isIniciado,
      canEditOrigen: isIniciado,
      canEditFechaInicio: isIniciado,
      canEditKilometrosIniciales: isIniciado,
      canEditKilometrosFinales: isFinViaje,
      
      // Gestión de estados
      canChangeRemitosState: isIniciado || isInicioCarga || isFinCarga || isFinViaje,
      canFinalizeTrip: isFinViaje,
      canChangeTripState: !isFinViaje, // No se puede cambiar después de fin de viaje
      
      // Niveles de acceso
      canEditTrip: isIniciado,
      canManageTrip: isInicioCarga || isFinCarga || isFinViaje,
      
      // Estados específicos para fácil acceso
      isIniciado,
      isInicioCarga,
      isFinCarga,
      isFinViaje
    };
  }, [estado]);
};