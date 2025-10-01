// contexts/DistributionFormContext.tsx
import { createContext, useContext } from 'react';
import { Localidad, Provincia } from '../hooks/useGeoref';
import { ViajeDistribucionDto } from '../api/generated';

export interface DistributionFormContextType {
  form: any;
  permissions: any;
  tripData?: ViajeDistribucionDto;
  isEditing?: boolean;
  // Estados de ubicación
  selectedPais: string;
  selectedProvincia: Provincia | null;
  selectedLocalidad: Localidad | null;
  // Funciones para actualizar ubicación
  setSelectedPais: (pais: string) => void;
  setSelectedProvincia: (provincia: Provincia | null) => void;
  setSelectedLocalidad: (localidad: Localidad | null) => void;
}

export const DistributionFormContext = createContext<DistributionFormContextType | null>(null);

export const useDistributionFormContext = () => {
  const context = useContext(DistributionFormContext);
  if (!context) {
    throw new Error('useDistributionFormContext must be used within a DistributionFormProvider');
  }
  return context;
};

// Hook más específico para acceder a partes del context
export const useDistributionForm = () => {
  const context = useDistributionFormContext();
  return context.form;
};

export const useTripPermissions = () => {
  const context = useDistributionFormContext();
  return context.permissions;
};

export const useTripData = () => {
  const context = useDistributionFormContext();
  return context.tripData;
};

export const useFormMode = () => {
  const context = useDistributionFormContext();
  return {
    isEditing: context.isEditing || false,
    isCreating: !context.isEditing
  };
};

export const useLocationData = () => {
  const context = useDistributionFormContext();
  return {
    selectedPais: context.selectedPais,
    selectedProvincia: context.selectedProvincia,
    selectedLocalidad: context.selectedLocalidad,
    setSelectedPais: context.setSelectedPais,
    setSelectedProvincia: context.setSelectedProvincia,
    setSelectedLocalidad: context.setSelectedLocalidad,
  };
}