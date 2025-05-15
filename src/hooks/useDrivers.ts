import { useState, useCallback, useEffect } from "react";
import { Driver } from "../types";
import { createDriver, deleteDriver, fetchDrivers, updateDriver } from "../lib/apiDriver";
import { useNotify } from "./useNotify";

export const useDriver = () => {
    const [driver, setDriver] = useState<Driver[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error|null> (null);
    const { notify } = useNotify("Chofer");

    //fetch
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

    //crear
    const addDriver = useCallback(async(FormData: Partial<Driver>) => {
        try{
            const newDriver = await createDriver(FormData);
            setDriver(prev => [...prev, newDriver]);
        }
        catch(err){
            setError(err as Error)
            throw err;
        }
    }, []);

    //editar
    const editDriver = useCallback(async(id:string, FormData: Partial<Driver>) => {
        try{
            const actDriver = await updateDriver(id, FormData);
            setDriver(prev => prev.map(dri => (dri._id === actDriver._id? actDriver:dri)));
        }
        catch (err){
            setError(err as Error);
            throw err;
        }
    },[])

    //eliminar
    const removeDriver = useCallback(async(id:string) => {
        try{
            await deleteDriver(id);
            setDriver(prev => prev.filter(dri => dri._id !== id));
            notify("delete")
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
        addDriver, 
        editDriver,
        removeDriver,
        reload: loadDrivers
    }
}