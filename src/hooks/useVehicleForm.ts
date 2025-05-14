import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Vehicle } from "../types";
import { createVehicle, fetchVehicleById, updateVehicle } from "../lib/api";
import { SelectChangeEvent } from "@mui/material";

export const useVehicleForm = (id? : string) => {
    const navigate = useNavigate();
    const isEditing = !!(id);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        _id: "",
        patente: "",
        modelo: "",
        marca: "",
        tipo: "",
        empresa: "",
        año: 1521,
        peso_carga: 0,
        volumen_carga: 0,
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isEditing && id){
            fetchVehicleById(id!)
                .then((vehicle: Vehicle) => setFormData(vehicle))
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        // Castear a number si corresponde
        const parsedValue =
            e.target instanceof HTMLInputElement && e.target.type === "number"
                ? Number(value)
                : value;

        setFormData((prev) => ({
            ...prev,
            [name!]: parsedValue,
        }));

        // Marcar el campo como tocado
        setTouched((prev) => ({
            ...prev,
            [name!]: true,
        }));
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
            case "patente":
            case "modelo":
            case "marca":
            case "empresa":
            case "tipo":
            if (isEmpty(value)) {
                error = "Este campo es obligatorio.";
            } else if (typeof value === "string" && value.trim().length < 3) {
                error = "Debe tener al menos 3 caracteres.";
            }
            break;
            case "año":
            if (!value || isNaN(value)) {
                error = "Campo obligatorio.";
            } else if (value < 1900 || value > 2025) {
                error = "Debe estar entre 1900 y 2025.";
            }
            break;
            case "peso_carga":
            case "volumen_carga":
            if (!value || isNaN(value)) {
                error = "Campo obligatorio.";
            } else if (value <= 0) {
                error = "Debe ser mayor a 0.";
            }
            break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        };

    const validate = (data: Partial<Vehicle>): boolean => {
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

        requiredString(data.patente, "patente", 6);
        requiredString(data.modelo, "modelo");
        requiredString(data.marca, "marca");
        requiredString(data.empresa, "empresa", 3,"Debe seleccionar una empresa");
        requiredString(data.tipo, "tipo",  3,"Debe seleccionar un tipo de vehículo");

        requiredNumber(data.año, "año", { min: 1900, max: 2025 });
        requiredNumber(data.peso_carga, "peso_carga", { min: 1 });
        requiredNumber(data.volumen_carga, "volumen_carga", { min: 1 });

        setErrors(newErrors);
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
                await updateVehicle(id!, formData as Omit<Vehicle, "_id">);
            } else {
                await createVehicle(formData as Omit<Vehicle, "_id">);
            }
            navigate("/vehicles");
        } catch (err) {
            alert("Error al guardar el vehículo");
        } finally {
            setLoading(false);
        }
    };


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