import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../useNotify";
import { CreateDepositoDto, depositoControllerCreate, depositoControllerUpdate, useDepositoControllerFindOne } from "../../api/generated";
import { useForm } from "react-hook-form";
import { CreateDepositoSchema, UpdateDepositoSchema } from "../../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";


export const useDepositForm = (id? : string) => {
    const navigate = useNavigate();
    const {notify} = useNotify("Depósito", "male");
    const isEditing = !!(id);
    const {
        register,
        control,
        reset,
        formState: { errors: formErrors, isValid,isSubmitting},
        handleSubmit,
        watch,
    } = useForm<CreateDepositoSchema>({
        resolver: zodResolver(CreateDepositoSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            nombre: "",
            direccion: {
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
                nombre: "",
                telefono: {
                    codigo_pais: "",
                    codigo_area: "",
                    numero: ""
                },
                email: ""
            }
        },
    });

    const { data, isLoading, error } = useDepositoControllerFindOne(id!, { query: { enabled: isEditing } });

    useEffect(() => {
        if (isEditing && data && data.data) {
            const { _id, direccion, contacto, ...rest } = data.data ;
            const { _id: idContacto, ...dataContacto } = contacto;
            const { _id: idTelefono, ...telefono } = contacto.telefono;
            const { _id: idDireccion, ...direccionData } = direccion;

            // Ensure 'tipo' is one of the allowed values and 'direccion' is included
            reset({
                ...rest,
                tipo: rest.tipo === "propio" || rest.tipo === "tercero" ? rest.tipo : "propio",
                direccion: {
                    ...direccionData,
                    tipo: direccion.tipo === "deposito" || direccion.tipo === "fiscal" ? direccion.tipo : "deposito",
                },
                contacto: {
                    ...dataContacto,
                    telefono
                },
            })
        }
    }, [isEditing, data]);

    const onSubmit = async (formData: CreateDepositoSchema | UpdateDepositoSchema) => {
        if (isEditing) {
          await handleUpdate(formData as UpdateDepositoSchema);
        } else {
          await handleCreate(formData as CreateDepositoSchema);
        }
      };
    
      const handleCreate = async (formData: CreateDepositoSchema) => {
        try {
          const {   contacto, ...rest } = formData;
            const { telefono, ...contactoData } = contacto;
            const depositData = {
                ...rest,
                lat: Number(rest.lat),
                long: Number(rest.long),
                contacto: {
                    ...contactoData,
                    telefono
                },
            };

            await depositoControllerCreate(depositData as CreateDepositoDto);
            notify("create");
            navigate("/depots");
        } catch (e) {
          const error = e as { response?: { data?: { message?: string } } };
          if (error.response?.data?.message) {
            notify("error", error.response.data.message);
          }
        }
      }
    
      const handleUpdate = async (formData: UpdateDepositoSchema) => {
        try {
          const { _id, contacto, ...rest } = formData;
          const { telefono, ...contactoData } = contacto;
          // Asegúrese de que los campos de teléfono no estén indefinidos
          const safeTelefono = {
            codigo_pais: telefono.codigo_pais ?? "",
            codigo_area: telefono.codigo_area ?? "",
            numero: telefono.numero ?? ""
          };
          const dataToUpdate = {
            ...rest,
            contacto: {
              ...contactoData,
              telefono: safeTelefono
            }
          };
          await depositoControllerUpdate(id!, dataToUpdate);
          notify("update");
          navigate("/depots");
        } catch (e) {
          const error = e as { response?: { data?: { message?: string } } };
          if (error.response?.data?.message) {
            notify("error", error.response.data.message);
          }
        }
      }

    return {
        handleSubmit,
        onSubmit,
        isEditing,
        isLoading,
        error,
        formErrors,
        register,
        control,
        isValid,
        reset,
        watch,
        isSubmitting,
    };
}