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