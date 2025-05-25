import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectChangeEvent } from "@mui/material";
import { useNotify } from "../useNotify";
import { CreateDepositoDto, depositoControllerCreate, depositoControllerUpdate, DepositoDto, UpdateDepositoDto, useDepositoControllerFindOne } from "../../api/generated";

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
    tipo: { required: true },
    lat: { required: true, isNumber: true, min: -90, max: 90 },
    long: { required: true, isNumber: true, min: -180, max: 180 },
    horario_entrada: { required: true },
    horario_salida: { required: true },
    restricciones: { required: false },
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
// Estado inicial del formulario
const initialFormState: DepositoDto = {
  _id: "",
  nombre: "",
  direccion: {
    _id: "",
    calle: "",
    numero: "",
    ciudad: "",
    estado_provincia: "",
    pais: "",
    tipo: "deposito",
  },
  lat: 0,
  long: 0,
  tipo: "propio",
  horario_entrada: "",
  horario_salida: "",
  restricciones: "",
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
  }
};

export const useDepositForm = (id? : string) => {
    const navigate = useNavigate();
    const {notify} = useNotify("Vehículo");
    const isEditing = !!(id);

    const { data } = useDepositoControllerFindOne(id!, { query: { enabled: isEditing } });
    const [formData, setFormData] = useState<DepositoDto>(initialFormState);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        if (isEditing && data?.data) {
            setFormData(data.data);
        }
    }, [isEditing, data, id]);

    const validatePhone = (data: DepositoDto): Record<string, string> => {
        const errors: Record<string, string> = {};
        const { codigo_pais, codigo_area, numero } = data.contacto.telefono;

        // Validar código de país
        if (!codigo_pais) {
            errors["contacto.telefono.codigo_pais"] = "Código país requerido";
        } else if (!/^\+?\d+$/.test(codigo_pais)) {
            errors["contacto.telefono.codigo_pais"] = "Solo se permiten números";
        }

        // Validar código de área solo si es Argentina (+54)
        if (codigo_pais === "+54") {
            if (!codigo_area) {
                errors["contacto.telefono.codigo_area"] = "Código de área requerido";
            } else if (!/^\d+$/.test(codigo_area)) {
                errors["contacto.telefono.codigo_area"] = "Solo se permiten números";
            }
        }

        // Validar número
        if (!numero) {
            errors["contacto.telefono.numero"] = "Número requerido";
        } else if (!/^\d+$/.test(numero)) {
            errors["contacto.telefono.numero"] = "Solo se permiten números y no debe haber espacios";
        } else if (numero.length < 6) {
            errors["contacto.telefono.numero"] = "El número debe tener al menos 6 dígitos";
        }

        return errors;
    };

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

        return "";
    }, []);

    const validateForm = useCallback((data: DepositoDto): boolean => {
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

        // Validación adicional para el teléfono
        const phoneErrors = validatePhone(data);
        Object.assign(newErrors, phoneErrors);
        if (Object.keys(phoneErrors).length > 0) {
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }, [validateField]);

    
    const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (!name) return;

        const parts = name.split(".");
        setFormData(prev => {
        const updated = { ...prev } as any;
        let current = updated;

        for (let i = 0; i < parts.length - 1; i++) {
            const key = parts[i];
            if (!current[key]) current[key] = {};
            current = current[key];
        }

        current[parts[parts.length - 1]] = value;

        return updated;
        });

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
        const fullFormData = formData as DepositoDto;
        if (!validateForm(fullFormData)) {
            setLoading(false);
            return;
        }

        try {
        if (isEditing) {
            const { _id, direccion,contacto, ...rest } = fullFormData;
            const { _id: dirId, ...direccionData } = direccion;
            const { _id: contactoId, telefono, ...contactoData } = contacto;
            const { _id: telId, ...telefonoData } = telefono;
            const depositData = {
                ...rest,
                lat: Number(rest.lat),
                long: Number(rest.long),
                direccion: direccionData,
                contacto: {
                    ...contactoData,
                    telefono: telefonoData,
                },
            };
            
            console.log("depositData", depositData);
            await depositoControllerUpdate(id, depositData as UpdateDepositoDto);
            notify("update");
        } else {
            // Omit _id for createDeposit
            const { _id, direccion, contacto, ...rest } = fullFormData;
            const { _id: dirId, ...direccionData } = direccion;
            const { _id: contactoId, telefono, ...contactoData } = contacto;
            const { _id: telId, ...telefonoData } = telefono;
            const depositData = {
                ...rest,
                lat: Number(rest.lat),
                long: Number(rest.long),
                direccion: direccionData,
                contacto: {
                    ...contactoData,
                    telefono: telefonoData,
                },
            };

            await depositoControllerCreate(depositData as CreateDepositoDto);
            notify("create");
        }
        navigate("/depots");
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }finally {
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