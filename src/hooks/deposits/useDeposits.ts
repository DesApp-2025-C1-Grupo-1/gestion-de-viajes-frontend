import { useState, useCallback, useEffect } from "react";
import { Deposit } from "../../types";
import { fetchDeposits, deleteDeposit } from "../../lib/apiDeposit";
import { useNotify } from "../useNotify";

export const useDeposits = () => {
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error|null> (null);
    const { notify } = useNotify("Chofer");

    //fetch
    const loadDeposits = useCallback(async() => {
        try{
            setIsLoading(true);
            const data = await fetchDeposits();
            setDeposits(data);
        }
        catch(err){
            setError(err as Error);
        }
        finally{
            setIsLoading(false);
        }
    }, []);


    //eliminar
    const removeDeposit = useCallback(async(id:string) => {
        try{
            await deleteDeposit(id);
            setDeposits(prev => prev.filter(dep => dep._id !== id));
            notify("delete")
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    },[])

    useEffect(() => {
        loadDeposits();}
    , [loadDeposits]);

    return{
        deposits,
        isLoading,
        error,
        removeDeposit,
        reload: loadDeposits
    }
}