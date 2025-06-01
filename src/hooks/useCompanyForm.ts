//api company orval
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material";
import { useNotify } from "./useNotify";
import { CreateEmpresaDto, empresaControllerCreate, EmpresaDto, UpdateEmpresaDto, useEmpresaControllerFindOne, empresaControllerUpdate, ContactoDto, DireccionDto } from "../api/generated";

type ValidationRule = {
    required?: boolean;
    minLength?: number;
    isNumber?: boolean;
    min?: number;
    max?: number;
    isEmail?: boolean;
    isPhone?: boolean;
};

const validationRules: Record<string, ValidationRule> = {
    razon_social: {required: true, minLength:3},
    nombre_comercial: {required: true, minLength:3},
    cuit: {required: true, minLength:11},
    "contacto.nombre": { required: true, minLength: 3 },
    "contacto.email": { required: true, isEmail: true },
    "contacto.telefono.codigo_pais": { required: true},
    "contacto.telefono.codigo_area": { required: false},
    "contacto.telefono.numero": { required: true},
    "direccion.calle": { required: true },
    "direccion.numero": { required: true },
    "direccion.ciudad": { required: true },
    "direccion.estado_provincia": { required: true },
    "direccion.pais": { required: true },
};

const initialFormState: EmpresaDto = {
    _id: "",
    razon_social: "",
    nombre_comercial: "",
    cuit: "",
    contacto: {
        _id: "",
        nombre: "",
        telefono: {
            _id: "",
            codigo_pais: "",
            codigo_area: "",
            numero: ""
        },
        email: ""
    },
    direccion: {
        _id: "",
        calle: "",
        numero: "",
        ciudad: "",
        estado_provincia: "",
        pais: "",
        tipo: "fiscal",
    },
};

export const useFormCompany = (id?: string) => {
    const navigate = useNavigate();
    const {notify} = useNotify("Empresa");

    const isEditing = !!(id);
    const {data} = useEmpresaControllerFindOne(id!, {query: {enabled:isEditing}});


    const [formData, setFormData] = useState<EmpresaDto>(initialFormState);
    const [touched, setTouched] = useState<{[key:string]: boolean}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isEditing && data?.data){
            setFormData(data.data);
        }
    }, [isEditing, data, id]);

    const validateTelefono = (data:EmpresaDto): Record<string, string> => {
        const errors: Record<string, string> = {};
        const {codigo_pais, codigo_area, numero} = data.contacto.telefono;

        if(!codigo_pais){
            errors["contacto.telefono.codigo_pais"] = "El codigo del pais es requerido";
        }
        else if(!/^\+?\d+$/.test(codigo_pais)){
            errors["contacto.telefono.codigo_pais"] = "Solo se permiten números";
        }

        if(codigo_area === "+54"){
            if(!codigo_area){
                errors["contacto.telefono.codigo_area"] = "El codigo de area es requerido";
            }
        }
        else if(!/^\+?\d+$/.test(codigo_area)){
            errors["contacto.telefono.codigo_area"] = "Solo se permiten números";
        }
        if(!numero){
            errors["contacto.telefono.numero"] = "Número requerido";
        }
        else if(numero.length < 6){
            errors["contacto.telefono.numero"] = "El número debe tener al menos 6 digitos";
        }
        return errors;
    };

    const validateField = useCallback((name:string, value:any): string => {
        const fieldRules = validationRules[name as keyof typeof validationRules];
        if(!fieldRules) return "";
        if(fieldRules.required && (!value || (typeof value === "string" && value.trim() === ""))){
            return "Este campo es obligatorio"
        }
        if (fieldRules.minLength && typeof value === "string" && value.trim().length < fieldRules.minLength){
            return `Debe tener al menos ${fieldRules.minLength} caracteres`;
        }

        if(fieldRules.isNumber){
            const numValue = Number(value);
            if(isNaN(numValue)) return "Debe ser un número válido";
            if(fieldRules.min !== undefined && numValue < fieldRules.min){
                return `El valor mínimo es ${fieldRules.min}`;
            }
            if(fieldRules.max !== undefined && numValue > fieldRules.max){
                return `El valor máximo es ${fieldRules.max}`;
            }
        }

        if(fieldRules.isEmail && !/\S+@\S+\.\S+/.test(value)){
            return "Email inválido";
        }
        return "";  
    }, []);

    const validateForm = useCallback((data: EmpresaDto): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        Object.keys(validationRules).forEach(key => {
            const parts = key.split(".");
            let value: any = data;
            for (const part of parts) {
                value = value?.[part];
            }

            const error = validateField(key, value);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        /*
        const cleanedCuit = data.cuit.replace(/-/g, ""); 

        console.log("CUIT ingresado:", data.cuit);
        console.log("CUIT sin guiones:", cleanedCuit);
        console.log("Longitud final del CUIT:", cleanedCuit?.length);

        if (!cleanedCuit || cleanedCuit.length !== 11) {
            newErrors["cuit"] = "El CUIT debe contener exactamente 11 números.";
            isValid = false;
        }*/

        const phoneErrors = validateTelefono(data);
        Object.assign(newErrors, phoneErrors);
        if (Object.keys(phoneErrors).length > 0){
            isValid = false;
        };
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    },[validateField]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        if(!name) return;

        const parts = name.split(".");
        setFormData(prev => {
            const updated = {...prev} as any;
            let current = updated;

            for (let i=0; i<parts.length-1; i++){
                const key = parts[i];
                if(!current[key]) current[key] = {};
                current = current[key];
            }

            current[parts[parts.length-1]] = value;
            return updated;
        });

        
        setTouched(prev => ({...prev, [name]: true}));
        setErrors(prev => ({...prev, [name]: validateField(name, value)}));
    }, [validateField]);

    const formatCuit = (value: string): string => {
        let initialValue = value.replace(/-/g, "");

        if (initialValue.length > 2){
            initialValue = initialValue.slice(0,2) + "-" + initialValue.slice(2);
        }
        if (initialValue.length > 10){
            initialValue = initialValue.slice(0,11) + "-" + initialValue.slice(11);
        }
        return initialValue;
    };
   
    /*
    const handleChangeCuit = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!name) return;

        const formattedCuit = formatCuit(value); 

        setFormData((prev) => {
            const updated = { ...prev } as any;
            let current = updated;

            const parts = name.split(".");
            for (let i = 0; i < parts.length - 1; i++) {
                const key = parts[i];
                if (!current[key]) current[key] = {};
                current = current[key];
            }

            current[parts[parts.length - 1]] = formattedCuit; 
            return updated;
        });
    }, [setFormData]);*/

    const handleSubmit = useCallback(async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate form
        const fullFormData = formData as EmpresaDto;
        if (!validateForm(fullFormData)) {
            setLoading(false);
            return;
        };

        try{
            if(isEditing){
                const {_id, direccion, contacto, ...reset} = fullFormData;
                const { _id: dirId, ...direccionData } = direccion;
                const { _id: contactoId, telefono, ...contactoData } = contacto;
                const { _id: telId, ...telefonoData } = telefono;
                const empresaData = {
                    ...reset,
                    //ver esto
                    direccion: direccionData,
                    contacto: {
                        ...contactoData,
                        telefono: telefonoData,
                    },
                };

                console.log("empresaData", empresaData);
                await empresaControllerUpdate(id, empresaData as UpdateEmpresaDto);
                notify("update");
            }
            else{
                const{_id, direccion, contacto, ...rest} = fullFormData;
                const{_id: dirId, ...direccionData} = direccion;
                const{_id: contactoId, telefono, ...contactoData} = contacto;
                const{_id: telId, ...telefonoData} = telefono;
                const empresaData = {
                    ...rest,
                    direccion: direccionData,
                    contacto: {
                        ...contactoData,
                        telefono: telefonoData,
                    },
                };

                await empresaControllerCreate(empresaData as CreateEmpresaDto);
                notify("create");
            }

            navigate("/companies");
        } catch(err){
            const error = err as {response:{data: {message:string}}};
            if(error.response?.data?.message){
                notify("error", error.response.data.message);
            }
        } finally{
            setLoading(false);
        }
    
    }, [formData, isEditing, id, navigate, notify, validateForm]);

    return { formData, loading, errors, touched, handleChange, handleSubmit, isEditing, setFormData};
}
//handleChangeCuit
