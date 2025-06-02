import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, ChoferDto, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, EmpresaDto, CreateChoferDtoTipoLicencia } from '../api/generated';
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import LoadingState from '../components/LoadingState';
import { getTokenSourceMapRange } from "typescript";
import { boolean, isValid } from 'zod';

type ValidationRule = {
    required?: boolean;
    minLength?: number;
    isNumber?: boolean;
    min?: number;
    max?: number;
    isEmail?: boolean;
    isPhone?: boolean;
    isDate?: boolean;
    isBeforeToday?: boolean;
    tipoLicences?: string[]
};

const licenciasValidas = Object.values(CreateChoferDtoTipoLicencia);

const validationRules: Record<string, ValidationRule> = {
    nombre: {required:true, minLength:3},
    apellido: {required:true, minLength:3},
    dni: {required:true, minLength:8},
    //fecha_nacimiento: {required:true, isDate: true, isBeforeToday: true},
    fecha_nacimiento: {required:true},
    licencia: {required:true, minLength:8},
    tipo_licencia: {required:true, tipoLicences:licenciasValidas},
    "telefono.codigo_pais": {required:true},
    "telefono.codigo_area": {required:true},
    "telefono.numero": {required:true},
    email: {required:true, isEmail:true},
    "empresa": {required:true},
    "vehiculo": {required:true}
};

export type ChoferFormData = {
    _id: string;
    nombre: string;
    apellido: string;
    dni: number;
    fecha_nacimiento: string; 
    licencia: string;
    tipo_licencia: string;
    telefono: {
        _id: string;
        codigo_pais: string;
        codigo_area: string;
        numero: string;
    };
    email: string;
    empresa: string;   // saco id para select 
    vehiculo: string;  
};

//funciones para mapear de dto a form y vis (arreglar)

const mapChoferDtoToForm = (dto: ChoferDto): ChoferFormData => ({
  _id: dto._id,
  nombre: dto.nombre,
  apellido: dto.apellido,
  dni: dto.dni,
  fecha_nacimiento: dto.fecha_nacimiento,
  licencia: dto.licencia,
  tipo_licencia: dto.tipo_licencia,
  telefono: {
    _id: dto.telefono._id,
    codigo_pais: dto.telefono.codigo_pais,
    codigo_area: dto.telefono.codigo_area,
    numero: dto.telefono.numero,
  },
  email: dto.email,
  empresa: dto.empresa._id,
  vehiculo: dto.vehiculo._id,
});

const mapFormToCreateChoferDto = (form: ChoferFormData): CreateChoferDto => ({
  nombre: form.nombre,
  apellido: form.apellido,
  dni: form.dni,
  fecha_nacimiento: form.fecha_nacimiento,
  licencia: form.licencia,
  tipo_licencia: form.tipo_licencia as CreateChoferDtoTipoLicencia,
  telefono: {
    codigo_pais: form.telefono.codigo_pais,
    codigo_area: form.telefono.codigo_area,
    numero: form.telefono.numero,
  },
  email: form.email,
  empresa: form.empresa,
  vehiculo: form.vehiculo,
});

const mapFormToUpdateChoferDto = (form: ChoferFormData): UpdateChoferDto => ({
  nombre: form.nombre,
  apellido: form.apellido,
  dni: form.dni,
  fecha_nacimiento: form.fecha_nacimiento,
  licencia: form.licencia,
  tipo_licencia: form.tipo_licencia as CreateChoferDtoTipoLicencia,
  telefono: {
    codigo_pais: form.telefono.codigo_pais,
    codigo_area: form.telefono.codigo_area,
    numero: form.telefono.numero,
  },
  email: form.email,
  empresa: { _id: form.empresa },
  vehiculo: { _id: form.vehiculo },
});

const initialFormState: ChoferFormData = {
    _id: "",
    nombre: "",
    apellido: "",
    dni: 0,
    fecha_nacimiento: "",
    licencia: "",
    tipo_licencia: "",
    telefono: {
            _id: "",
            codigo_pais: "",
            codigo_area: "",
            numero: ""
    },
    email: "",
    empresa: "",
    vehiculo: "",
};

export const useFormDriver = (id?: string) => {
    const navigate = useNavigate();
    const {notify} = useNotify("Chofer");

    const isEditing = !!(id);
    const {data} = useChoferControllerFindOne(id!, {query: {enabled:isEditing}});

    const [formData, setFormData] = useState<ChoferFormData>(initialFormState);
    const [touched, setTouched] = useState<{[key:string]: boolean}>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isEditing && data?.data){
            setFormData(mapChoferDtoToForm(data.data));
        }
    }, [isEditing, data, id]);

    const validateTelefono = (data:ChoferFormData): Record<string, string> => {
        const errors: Record<string, string> = {};
        const {codigo_pais, codigo_area, numero} = data.telefono;

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

    const cleanChoferData = (data: ChoferDto): UpdateChoferDto => {
        const removeIdAndV = <T extends { _id?: any; __v?: any }>(obj: T): Omit<T, '_id' | '__v'> => {
            const { _id, __v, ...rest } = obj;
            return rest;
        };

        return {
            ...removeIdAndV(data),
            //armar remove de empre y vehiculo
            telefono: {
                ...removeIdAndV(data.telefono)
            }
        };
    };

    const validateForm = useCallback((data: ChoferFormData): boolean => {
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

        const phoneErrors = validateTelefono(data);
        Object.assign(newErrors, phoneErrors);
        if (Object.keys(phoneErrors).length > 0){
            isValid = false;
        };
        
        setErrors(prev => ({ ...prev, ...newErrors }));
        return isValid;
    },[validateField]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
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

    const handleSubmit = useCallback(async(e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate form
        const fullFormData = mapFormToCreateChoferDto(formData);
        if (!validateForm(formData)) {
            setLoading(false);
            return;
        };

        try{
            if(isEditing){
                const choferData =  mapFormToUpdateChoferDto(formData);
                await choferControllerUpdate(id, choferData);
                notify("update");
            }
            else {
                const choferData = mapFormToCreateChoferDto(formData);
                await choferControllerCreate(choferData);
                notify("create")
            }

            navigate("/drivers");
        } catch(err){
            const error = err as {response:{data: {message:string}}};
            if(error.response?.data?.message){
                notify("error", error.response.data.message);
            }
        } finally{
            setLoading(false);
        }
    }, [formData, isEditing, id, navigate, notify, validateForm]);

    return {formData, loading, errors, touched, handleChange, handleSubmit, isEditing, setFormData}

}



/*import { SelectChangeEvent } from "@mui/material";
import { useEffect, useState } from "react";
import { Driver } from "../types";
import { createDriver, fetchDriverById, updateDriver } from "../lib/apiDriver";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const useDriverForm = (id?:string) => {
    const navigate = useNavigate();
    const isEditing = !!(id);
    const [touched, setTouched] = useState<{[key:string]: Boolean}>({});
    const [formData, setFormData] = useState<Partial<Driver>>({
        _id: "",
        nombre:"",
        apellido:"",
        dni:0,
        fecha_nacimiento: dayjs(),
        empresa: "",
        vehiculo: "",
        licencia: 0,
        tipo_licencia: "",
        telefono: 0,
        email:"",
    });

    const [loading, setLoading] = useState(false);
    const [errs, setErrs] = useState<Record<string, string>> ({});

    useEffect(() => {
        if(isEditing && id){
            fetchDriverById(id!).then((driver: Driver) => setFormData(driver))
        }
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | 
                                HTMLTextAreaElement | 
                                {name?: string; value:unknown}>) => {
                                    const {name,value} = e.target
                            
    const parsed = e.target instanceof HTMLInputElement && e.target.type === "number" ? Number(value) : value;
    setFormData((prev) => ({...prev, [name!]: parsed,}));
    setTouched((prev) => ({...prev, [name!]: true}));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (name) {
            setFormData((prev) => ({ ...prev, [name]: value as string }));
            setTouched((prev) => ({ ...prev, [name]: true }));

            validateField(name, value as string);
        }
    };

    const validateField = (name: string, value: any) => {
        let error = "";

        const isEmpty = (v: any) => !v || (typeof v === "string" && v.trim() === "");

        switch (name) {
            case "nombre":
            case "apellido":
            case "dni":
            case "fecha de nacimiento":
            case "empresa transportista":
            case "vehiculo":
        }

        setErrs((prev) => ({ ...prev, [name]: error }));
        };

    const validate = (data: Partial<Driver>): boolean => {
        const newErrors: { [key: string]: string } = {};

        const requiredString = (value: any, label: string, minLength = 3, text?: string) => {
        if (!value || typeof value !== "string" || value.trim().length < minLength) {
            newErrors[label] = text ? `${text}` :`Debe tener al menos ${minLength} caracteres.`;
        }
        };

        const requiredNumber = (value: any, label: string, options?: { min?: number; max?: number }) => {
        if (value === null || value === undefined || isNaN(value)) {
            newErrors[label] = "Este campo es obligatorio.";
        } else {
            if (options?.min !== undefined && value < options.min ) {
            newErrors[label] = `Debe ser mayor o igual a ${options.min}.`;
            }
            if (options?.max !== undefined && value > options.max) {
            newErrors[label] = `Debe ser menor o igual a ${options.max}.`;
            }
        }
        };

        requiredString(data.nombre, "nombre");
        requiredString(data.apellido, "apellido");
        requiredNumber(data.dni, "dni");
        //fecha de nac
        requiredString(data.empresa, "empresa", 3,"Debe seleccionar una empresa");
        requiredString(data.vehiculo, "tipo",  3,"Debe seleccionar un tipo de vehículo");

        setErrs(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = validate(formData);
        if (!isValid) {
            // Marcar todos los campos como tocados
            const allTouched: Record<string, boolean> = {};
            Object.keys(formData).forEach((key) => {
                allTouched[key] = true;
            });
            setTouched(allTouched);
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await updateDriver(id!, formData as Omit<Driver, "_id">);
            } else {
                await createDriver(formData as Omit<Driver, "_id">);
            }
            navigate("/vehicles");
        } catch (err) {
            alert("Error al guardar el chofer");
        } finally {
            setLoading(false);
        }
    };


    return {
        formData,
        loading,
        errs,
        touched,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isEditing,
    };


}*/