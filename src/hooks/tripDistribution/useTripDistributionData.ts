import { useEffect, useState } from "react";
import { useViajeDistribucionControllerFindOne } from "../../api/generated";

export const useTripDistributionData = (id?: string) => { // 🔥 Quitar el reset del parámetro
  const isEditing = !!id;
  const { data, error, isLoading } = useViajeDistribucionControllerFindOne(id!, { 
    query: { enabled: isEditing } 
  });

  // 🔥 Solo devolver los datos sin manejar el reset
  return { 
    isEditing, 
    data: data?.data, 
    isLoading, 
    error 
  };
};