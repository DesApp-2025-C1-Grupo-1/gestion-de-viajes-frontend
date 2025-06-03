import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, ChoferDto, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, EmpresaDto, CreateChoferDtoTipoLicencia, useEmpresaControllerFindAll, useVehiculoControllerFindAll } from '../api/generated';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { CreateChoferSchema, UpdateChoferSchema, createChoferSchema} from '../api/schemas/chofer.schema';
import { tipoLicenciaSchema } from "../api/schemas/enums/tipoLicencia.schema";

export const useDriverForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const licenciasValidas = Object.values(tipoLicenciaSchema.enum);
  
  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    formState: { errors: formErrors , isValid},
  } = useForm<CreateChoferSchema>({
    resolver: zodResolver(createChoferSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: undefined,
      fecha_nacimiento: Date(),
      licencia: "",
      tipo_licencia: licenciasValidas[0],
      telefono: {
        codigo_pais: "",
        codigo_area: "",
        numero: ""
      },
      email: "",
      empresa: "",
      vehiculo: "",
    },
  })

  const { data, isLoading, error } = useChoferControllerFindOne(id!, { query: { enabled: isEditing } });
  const { data: companies, error: errorEmpresa, isLoading: loadingEmpresas } = useEmpresaControllerFindAll();
  const { data: vehiculos, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();

  const { notify } = useNotify("Chofer");

  useEffect(() => {
    if (isEditing && data && data.data) {
      const { _id, empresa, vehiculo, ...rest } = data.data ;
      const {_id: idVehiculo} = vehiculo;
      const {_id: idEmpresa} = empresa;
      reset({
        ...rest,
        _id,
        vehiculo: idVehiculo,
        empresa: idEmpresa,
      } as CreateChoferSchema);
    }
  }, [isEditing, data]);

  const onSubmit = async(FormData: CreateChoferSchema | UpdateChoferSchema) => {
    if(isEditing){
      await handleUpdate(FormData as UpdateChoferSchema);
    }
    else{
      await handleCreate(FormData as CreateChoferSchema);
    }
  };

  const handleUpdate = async(FormData: UpdateChoferSchema) => {
    try{
      const {_id, ...dataToUpdate} = FormData;

      await choferControllerUpdate(id!, dataToUpdate as UpdateChoferDto);
      notify("update");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  const handleCreate = async(FormData: CreateChoferSchema) => {
    try{
      await choferControllerCreate(FormData as CreateChoferDto);
      notify("create");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  return{
    onSubmit, handleSubmit, handleCreate, handleUpdate, isEditing, formErrors, register, control, isValid, reset, isLoading, error, companies, vehiculos, errorEmpresa, errorVehicles, licenciasValidas, watch, loadingAuxData: loadingEmpresas || loadingVehicles,
  }

}

/*
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
  empresa: form.empresa,
  vehiculo: form.vehiculo,
  //empresa: { _id: form.empresa },
  //vehiculo: { _id: form.vehiculo },
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
    */