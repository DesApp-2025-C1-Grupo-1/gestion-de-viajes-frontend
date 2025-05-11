import { useState, useCallback, useEffect } from 'react';
import { VehicleType } from "../types";
import { createVehicleType, deleteVehicleType, fetchVehicleTypes, updateVehicleType } from "../lib/api";

export const useVehicleTypes = () => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadVehicleTypes = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchVehicleTypes();
      setVehicleTypes(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addVehicleType = useCallback(async (formData: Partial<VehicleType>) => {
    try {
      const newType = await createVehicleType(formData);
      setVehicleTypes(prev => [...prev, newType]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const editVehicleType = useCallback(async (id: string, formData: Partial<VehicleType>) => {
    try {
      const updatedType = await updateVehicleType(id, formData);
      setVehicleTypes(prev => prev.map(type => (type._id === updatedType._id ? updatedType : type)));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const removeVehicleType = useCallback(async (id: string) => {
    try {
      await deleteVehicleType(id);
      setVehicleTypes(prev => prev.filter(type => type._id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  useEffect(() => {
    loadVehicleTypes();
  }, [loadVehicleTypes]);

  return {
    vehicleTypes,
    isLoading,
    error,
    addVehicleType,
    editVehicleType,
    removeVehicleType,
    reload: loadVehicleTypes
  };
};