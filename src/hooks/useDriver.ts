import { useState, useCallback, useEffect } from "react";
import { DriverType } from "../types";
import { createDriver, updateDriver, deleteDriver } from "../lib/apiDriver";
import { vehicleTypes } from "../lib/mock-data";

export const useDriver = () => {
    const [drivers, setDrivers] = useState<DriverType[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    //cargar choferes

    //add chofer
    const addDriver = useCallback( async(FormData: Partial<DriverType>) => {
        try{
            const newDriver = await createDriver(FormData);
            setDrivers(prev => [...prev, newDriver])
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    }, []);

    //update chofer
    const editDriver = useCallback( async(id:string, FormData: Partial<DriverType>) => {
        try{
            const editDriver = await updateDriver(id, FormData);
            setDrivers(prev => prev.map(dri => (dri._id === editDriver._id ? editDriver : dri)));
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    }, []);

    //delete chofer
    const removeDriver = useCallback( async(id:string) => {
        try{
            await deleteDriver(id);
            setDrivers(prev => prev.filter(dri => dri._id !== id));
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    }, []);

    useEffect(() => {
        //loadDrivers(); //[]
    })

    return{
        vehicleTypes,
        isLoading,
        error,
        addDriver,
        editDriver,
        removeDriver,
        //reload: loadDrivers
    }

}
