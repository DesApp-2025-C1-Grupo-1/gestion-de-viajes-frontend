// hooks/tripDistribution/types.ts
export type TripEstado = 'iniciado' | 'inicio de carga' | 'fin de carga' | 'fin de viaje';

export interface DistributionFormContextType {
  form: any;
  permissions: any;
  stateManager?: any;
  tripData?: any;
}