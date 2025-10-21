import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { useEmpresaControllerFindOne, empresaControllerCreate, empresaControllerUpdate, CreateEmpresaDto, UpdateEmpresaDto} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateEmpresaSchema, UpdateEmpresaSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";

export const useCompanyForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    const queryClient = useQueryClient();
    
    const {
        register,
        control,
        reset,
        handleSubmit,
        watch,
        formState: { errors: formErrors , isValid, isSubmitting},
    } = useForm<CreateEmpresaSchema>({
        resolver: zodResolver(CreateEmpresaSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            razon_social: "",
            nombre_comercial: "",
            cuit: "",
            direccion: {
                calle: "",
                numero: "",
                ciudad: "",
                estado_provincia: "",
                pais: "",
                tipo: "fiscal",
            },
            contacto: {
                nombre: "",
                email: "",
                telefono: {
                    codigo_pais: "",
                    codigo_area: "",
                    numero: ""
                }
            } 
        },
    });

    const { data, isLoading, error } = useEmpresaControllerFindOne(id!, { query: { enabled: isEditing } });
    const { notify } = useNotify("Empresa", "female");

    useEffect(() => {
        if (isEditing && data && data.data) {
        const { _id, ...rest } = data.data ;
        reset({
            ...rest,
            _id,
        } as CreateEmpresaSchema);
        }
    }, [isEditing, data]);

    const handleCreate = async (formData: CreateEmpresaSchema) => {
        try {
            await empresaControllerCreate(formData as CreateEmpresaDto);
            notify("create");
            await queryClient.invalidateQueries({ queryKey: ['/empresa'] });
            navigate("/companies");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleUpdate = async (formData: UpdateEmpresaSchema) => {
        try {
            const {_id, ...dataToUpdate} = formData;
            
            await empresaControllerUpdate(id!, dataToUpdate as UpdateEmpresaDto);
            notify("update");
            await queryClient.invalidateQueries({ queryKey: ['/empresa'] });
            navigate("/companies");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const onSubmit = async (formData: CreateEmpresaSchema | UpdateEmpresaSchema) => {
        if (isEditing) {
        await handleUpdate(formData as UpdateEmpresaSchema);
        } else {
        await handleCreate(formData as CreateEmpresaSchema);
        }
    };

    return{
        onSubmit,
        handleSubmit,
        handleCreate,
        handleUpdate,
        isEditing,
        formErrors,
        register,
        control,
        isValid,
        reset,
        isLoading,
        error,
        watch,
        isSubmitting,
    }
}

