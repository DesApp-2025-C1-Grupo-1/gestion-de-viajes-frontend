import { useState, useCallback, useEffect } from "react";
import { Company } from "../types";
import { createCompany, deleteCompany, updateCompany, fetchCompany } from "../lib/apiCompany";
import { useNotify } from "./useNotify";

export const useCompany = () => {
    const [company, setCompany] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error|null> (null);
    const { notify } = useNotify("Empresa transportista");

    const loadCompanies = useCallback(async() => {
        try{
            setIsLoading(true);
            const data = await fetchCompany();
            setCompany(data);
        }
        catch(err){
            setError(err as Error);
        }
        finally{
            setIsLoading(false);
        }
    }, []);

    const addCompany = useCallback(async(FormData: Partial<Company>) => {
        try{
            const newCompany = await createCompany(FormData);
            setCompany(prev=> [...prev, newCompany]);
        }
        catch(err){
            setError(err as Error)
            throw err;
        }
    }, []);

    const editCompany = useCallback(async(id:string, FormData: Partial<Company>) => {
        try{
            const actCompany = await updateCompany(id, FormData);
            setCompany(prev => prev.map(dri => (dri._id === actCompany._id ? actCompany:dri)));
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    }, []);

    const removeCompany = useCallback(async(id:string) => {
        try{
            await deleteCompany(id);
            setCompany(prev => prev.filter(dri => dri._id !== id));
            notify("delete")
        }
        catch(err){
            setError(err as Error);
            throw err;
        }
    }, []);

    useEffect(() => {loadCompanies();}, [loadCompanies]);

    return{
        company,
        isLoading,
        error,
        addCompany,
        editCompany,
        removeCompany,
        reload: loadCompanies
    }
};