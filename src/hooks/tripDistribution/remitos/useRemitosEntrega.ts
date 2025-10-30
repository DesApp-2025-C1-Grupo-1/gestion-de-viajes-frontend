import { useState } from "react";
import { EstadoEntrega } from "../../../types";

export function useRemitosEntrega(viajeId: string) {
  const [entregas, setEntregas] = useState<Record<number, boolean>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [bulkUpdating, setBulkUpdating] = useState<number[]>([]);

  const toggleEntrega = async (remitoId: number, estado: EstadoEntrega) => {
    try {
      setIsUpdating(true);
      setBulkUpdating(prev => [...prev, remitoId]);
      
      const entregado = estado === "entregado";
      
      // Simulación de API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setEntregas((prev) => ({
        ...prev,
        [remitoId]: entregado,
      }));
    } finally {
      setIsUpdating(false);
      setBulkUpdating(prev => prev.filter(id => id !== remitoId));
    }
  };

  const toggleEntregaMultiple = async (remitoIds: number[], estado: boolean) => {
    try {
      setIsUpdating(true);
      setBulkUpdating(prev => [...prev, ...remitoIds]);
      
      // Bulk update simulation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setEntregas((prev) => {
        const newState = { ...prev };
        remitoIds.forEach(id => {
          newState[id] = estado;
        });
        return newState;
      });
    } finally {
      setIsUpdating(false);
      setBulkUpdating(prev => prev.filter(id => !remitoIds.includes(id)));
    }
  };

  return { 
    entregas, 
    toggleEntrega, 
    toggleEntregaMultiple,
    isUpdating,
    bulkUpdating 
  };
}