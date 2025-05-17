import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Deposit } from "../../types";
import { SelectChangeEvent } from "@mui/material";
import { useNotify } from "../useNotify";
import { createDeposit, fetchDepositById, updateDeposit } from "../../lib/apiDeposit";


export const useDepositForm = (id? : string) => {
    const navigate = useNavigate();
    const isEditing = !!(id);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Deposit>>({
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
        contacto: {
            nombre: "",
            telefono: "",
            email: "",
        }
    });

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const {notify} = useNotify("Vehículo");

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;

        // Castear a number si corresponde
        const parsedValue =
            e.target instanceof HTMLInputElement && e.target.type === "number"
                ? Number(value)
                : value;


        if (!name) return;

        // Si el campo es un campo de contacto, actualiza el objeto contacto
        // de lo contrario, actualiza el objeto formData directamente
        setFormData((prev) => {
            if (name.startsWith("contacto.")) {
                const key = name.split(".")[1];
                return {
                    ...prev,
                    contacto: {
                        nombre: prev.contacto?.nombre ?? "",
                        telefono: prev.contacto?.telefono ?? "",
                        email: prev.contacto?.email ?? "",
                        [key]: parsedValue,
                    },
                };
            }

            return {
                ...prev,
                [name]: parsedValue,
            };
        });
        // Marcar el campo como tocado
        setTouched((prev) => ({
            ...prev,
            [name!]: true,
        }));

        if (touched[name!]) {
            validateField(name!, parsedValue);
        }
    };

    /* const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        if (name) {
            setFormData((prev) => ({ ...prev, [name]: value as string }));
            setTouched((prev) => ({ ...prev, [name]: true }));

            validateField(name, value as string);
        }
    }; */

    const validateField = (name: string, value: any) => {
        let error = "";

        const isEmpty = (v: any) => !v || (typeof v === "string" && v.trim() === "");

        switch (name) {
            case "nombre":
            case "direccion":
            case "ciudad":
            case "estado_provincia":
            case "pais":
            case "lat":
            case "long":
            case "horario_entrada":
            case "horario_salida":
            case "tipo":
            case "contacto.nombre":
            case "contacto.telefono":
            case "contacto.email":
            if (isEmpty(value)) {
                error = "Este campo es obligatorio.";
            } else if (typeof value === "string" && value.trim().length < 3) {
                error = "Debe tener al menos 3 caracteres.";
            }
            break;
        }

        setErrors((prev) => ({ ...prev, [name]: error }));
        };

    const validate = (data: Partial<Deposit>): boolean => {
        const newErrors: { [key: string]: string } = {};

        const requiredString = (value: any, label: string, minLength = 3, text?: string) => {
        if (!value || typeof value !== "string" || value.trim().length < minLength) {
            newErrors[label] = text ? `${text}` :`Debe tener al menos ${minLength} caracteres.`;
        }
        };

        requiredString(data.nombre, "patente", 6);
        requiredString(data.direccion, "modelo");
        requiredString(data.ciudad, "marca");
        requiredString(data.estado_provincia, "estado_provincia");
        requiredString(data.pais, "pais");
        requiredString(data.tipo, "tipo");
        requiredString(data.lat, "latitud");
        requiredString(data.long, "longitud");
        requiredString(data.horario_entrada, "horario_entrada");
        requiredString(data.horario_salida, "horario_salida");
        requiredString(data.contacto?.nombre, "contacto.nombre");
        requiredString(data.contacto?.telefono, "contacto.telefono");
        requiredString(data.contacto?.email, "contacto.email", 3, "Campo obligatorio.");
        if (data.contacto?.email && !/\S+@\S+\.\S+/.test(data.contacto.email)) {
            newErrors["contacto.email"] = "Email inválido.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const isValid = validate(formData);
        if (!isValid) {
            // Marcar todos los campos como tocados
            const allTouched: Record<string, boolean> = {};
            Object.keys(formData).forEach((key) => {
                allTouched[key] = true;
            });
            setTouched(allTouched);
            setTimeout(() => {
                setLoading(false);
            },500);
            return;
        }
        try {
            if (isEditing) {
                await updateDeposit(id!, formData as Omit<Deposit, "_id">);
                notify("update");
            } else {
                await createDeposit(formData as Omit<Deposit, "_id">);
                notify("create");
            }
            navigate("/depots");
        } catch (err) {
            notify("error");
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
        /* handleSelectChange, */
        handleSubmit,
        isEditing,
    };
}