import { useState, useCallback, useEffect } from "react";
import { DriverType } from "../types";
import { fetchDrivers } from "../lib/apiDriver";

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

    useEffect(() => {
        loadDrivers();}, [loadDrivers]);

    return{
        driver,
        isLoading,
        error,
        reload: loadDrivers
    }
}