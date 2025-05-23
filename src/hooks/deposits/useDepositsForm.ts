import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Deposit } from "../../types";
import { SelectChangeEvent } from "@mui/material";
import { useNotify } from "../useNotify";
import { createDeposit, fetchDepositById, updateDeposit } from "../../lib/apiDeposit";

type DepositContact = {
  nombre: string;
  telefono: string;
  email: string;
};

// Tipo para las reglas de validación
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
  nombre: { required: true, minLength: 3 },
  direccion: { required: true, minLength: 5 },
  ciudad: { required: true, minLength: 3 },
  estado_provincia: { required: true, minLength: 3 },
  pais: { required: true, minLength: 3 },
  tipo: { required: true },
  lat: { required: true, isNumber: true, min: -90, max: 90 },
  long: { required: true, isNumber: true, min: -180, max: 180 },
  horario_entrada: { required: true },
  horario_salida: { required: true },
  restricciones: { required: false },
  "contacto.nombre": { required: true, minLength: 3 },
  "contacto.telefono": { required: true, isPhone: true },
  "contacto.email": { required: true, isEmail: true }
};

// Estado inicial del formulario
const initialFormState: Deposit = {
  _id: "",
  nombre: "",
  direccion: "",
  ciudad: "",
  estado_provincia: "",
  pais: "",
  tipo: "propio",
  lat: "",
  long: "",
  horario_entrada: "",
  horario_salida: "",
  restricciones: "",
  contacto: {
    nombre: "",
    telefono: "",
    email: "",
  }
};

export const useDepositForm = (id? : string) => {
    const navigate = useNavigate();
    const {notify} = useNotify("Vehículo");
    const isEditing = !!(id);

    
    const [formData, setFormData] = useState<Partial<Deposit>>(initialFormState);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if(isEditing && id){
            setLoading(true);
            fetchDepositById(id!)
                .then((vehicle: Deposit) => setFormData(vehicle))
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [id]);


    const validateField = useCallback((name: string, value: any): string => {
        const fieldRules = validationRules[name as keyof typeof validationRules];
        if (!fieldRules) return "";

        // Required check
        if (fieldRules.required && (!value || (typeof value === "string" && value.trim() === ""))) {
        return "Este campo es obligatorio";
        }

        // Min length check
        if (fieldRules.minLength && typeof value === "string" && value.trim().length < fieldRules.minLength) {
        return `Debe tener al menos ${fieldRules.minLength} caracteres`;
        }

        // Number validation
        if (fieldRules.isNumber) {
        const numValue = Number(value);
        if (isNaN(numValue)) return "Debe ser un número válido";
        if (fieldRules.min !== undefined && numValue < fieldRules.min) {
            return `El valor mínimo es ${fieldRules.min}`;
        }
        if (fieldRules.max !== undefined && numValue > fieldRules.max) {
            return `El valor máximo es ${fieldRules.max}`;
        }
        }

        // Email validation
        if (fieldRules.isEmail && !/\S+@\S+\.\S+/.test(value)) {
        return "Email inválido";
        }

        // Phone validation
        if (fieldRules.isPhone && !/^[+\d][\d\s-]+$/.test(value)) {
        return "Teléfono inválido";
        }

        return "";
    }, []);

    const validateForm = useCallback((data: Deposit): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        Object.keys(validationRules).forEach(key => {
        const value = key.startsWith("contacto.") 
            ? data.contacto[key.split(".")[1] as keyof DepositContact]
            : data[key as keyof Deposit];
        
        const error = validateField(key, value);
        if (error) {
            newErrors[key] = error;
            isValid = false;
        }
        });

        setErrors(newErrors);
        return isValid;
    }, [validateField]);

    
    const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        if (!name) return;

        // Update form data
        setFormData(prev => {
            if (name.startsWith("contacto.")) {
                const contactField = name.split(".")[1] as keyof DepositContact;
                return {
                    ...prev,
                    contacto: {
                        ...((prev.contacto as DepositContact) ?? { nombre: "", telefono: "", email: "" }),
                        [contactField]: value as string
                    }
                };
            }
            return {
                ...prev,
                [name]: value as string
            };
        });

        // Mark as touched and validate
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        },
        [validateField]
    );

    const handleSelectChange = useCallback(
        (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (!name) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
        },
        [validateField]
    );


    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce((acc, key) => {
        acc[key] = true;
        return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate form
        const fullFormData = formData as Deposit;
        if (!validateForm(fullFormData)) {
            setLoading(false);
            return;
        }

        try {
        if (isEditing) {
            await updateDeposit(id, fullFormData);
            notify("update");
        } else {
            // Omit _id for createDeposit
            const { _id, ...depositData } = fullFormData;
            await createDeposit(depositData);
            notify("create");
        }
        navigate("/depots");
        } catch (error) {
        notify("error");
        } finally {
        setLoading(false);
        }
    }, [formData, isEditing, id, navigate, notify, validateForm]);


    return {
        formData,
        loading,
        errors,
        touched,
        handleChange,
        handleSelectChange,
        handleSubmit,
        isEditing,
    };
}