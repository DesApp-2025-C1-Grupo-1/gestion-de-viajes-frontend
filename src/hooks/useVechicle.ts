import { useState, useCallback, useEffect } from 'react';
import { Vehicle } from "../types";
import { deleteVehicle, fetchVehicle } from "../lib/api";
import { useNotify } from './useNotify';
// TODO eliminar este hook
export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { notify } = useNotify("Vehículo");

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

  const removeVehicle = useCallback(async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles(prev => prev.filter(veh => veh._id !== id));
      notify("delete")
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
    removeVehicle,
    reload: loadVehicles
  };
};