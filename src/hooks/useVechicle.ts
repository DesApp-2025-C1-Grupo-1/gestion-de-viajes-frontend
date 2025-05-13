import { useState, useCallback, useEffect } from 'react';
import { Vehicle } from "../types";
import { deleteVehicle, fetchVehicle } from "../lib/api";

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadVehicles = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchVehicle();
      setVehicles(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* const addVehicleType = useCallback(async (formData: Partial<Vehicle>) => {
    try {
      const newType = await createVehicleType(formData);
      setVehicles(prev => [...prev, newType]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);

  const editVehicleType = useCallback(async (id: string, formData: Partial<Vehicle>) => {
    try {
      const updatedType = await updateVehicleType(id, formData);
      setVehicles(prev => prev.map(type => (type._id === updatedType._id ? updatedType : type)));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []);
  */
  const removeVehicle = useCallback(async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles(prev => prev.filter(veh => veh._id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }, []); 

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  return {
    vehicles,
    isLoading,
    error,
    /* addVehicleType,
    editVehicleType,
     */
    removeVehicle,
    reload: loadVehicles
  };
};