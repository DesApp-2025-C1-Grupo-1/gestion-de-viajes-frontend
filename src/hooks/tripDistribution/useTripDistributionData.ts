import { useViajeDistribucionControllerFindOne } from "../../api/generated";

export const useTripDistributionData = (id?: string) => { 
  const isEditing = !!id;
  const { data, error, isLoading } = useViajeDistribucionControllerFindOne(id!, { 
    query: { enabled: isEditing } 
  });

  return { 
    isEditing, 
    data: data?.data, 
    isLoading, 
    error 
  };
};