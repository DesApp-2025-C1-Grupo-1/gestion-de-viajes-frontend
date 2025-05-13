import { useState, useCallback, useEffect } from "react";
import { DriverType } from "../types";
import { deleteDriver, fetchDrivers } from "../lib/apiDriver";

export const useDriver = () => {
    const [driver, setDriver] = useState<DriverType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error|null> (null);

    const loadDrivers = useCallback(async() => {
        try{
            setIsLoading(true);
            const data = await fetchDrivers();
            setDriver(data);
        }
        catch(err){
            setError(err as Error);
        }
        finally{
            setIsLoading(false);
        }
    }, []);

    const removeDriver = useCallback(async(id:string) => {
        try{
            await deleteDriver(id);
            setDriver(prev => prev.filter(dri => dri._id));
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    },[])

    useEffect(() => {
        loadDrivers();}, [loadDrivers]);

    return{
        driver,
        isLoading,
        error,
        removeDriver,
        reload: loadDrivers
    }
}