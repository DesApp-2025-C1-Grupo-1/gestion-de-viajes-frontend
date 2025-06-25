import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { viajeControllerCreate, viajeControllerUpdate} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateViajeSchema, UpdateViajeSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTripData } from "./trip/useTripData";
import useTripAuxData from "./trip/useTripAuxData";
import useCrossFieldValidation  from "./trip/useCrossFieldValidation";
import { useEffect } from "react";

export const useTripForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    const { notify } = useNotify("Viaje");

    const {
        register,
        control,
        reset,
        handleSubmit,
        watch,
        trigger,
        resetField,
        setValue,
        getValues,
        formState: { errors: formErrors , isValid,isSubmitting},
    } = useForm<CreateViajeSchema>({
        resolver: zodResolver(CreateViajeSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            fecha_inicio: undefined,
            fecha_llegada: undefined,
            tipo_viaje: "nacional",
            deposito_origen: "",
            deposito_destino: "",
            empresa: "",
            chofer: "",
            vehiculo: "",
        },
    });
    
    // 1. Cargar viaje si estamos editando
    const {isLoading,error} = useTripData(id, reset);
    
    // 2. Cargar datos auxiliares

    const {
        companies,
        depots,
        filteredVehiculos,
        filteredChoferes,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        loadingAuxData,
        filterByCompany
    } = useTripAuxData({control, resetField});
    
    // 3. Configurar validación cruzada
    useCrossFieldValidation({watch, trigger, setValue, depots});

    const handleSelectChofer = (choferId: string) => {
        if (!choferId) {
            setValue("vehiculo", "", { shouldValidate: true });
            return;
        }

        const selectedChofer = filteredChoferes.find(chofer => chofer._id === choferId);
        const vehiculoId = selectedChofer?.vehiculo?._id || "";
        
        setValue("vehiculo", vehiculoId, { shouldValidate: true });
        
        // Opcional: Forzar validación cruzada
        if (vehiculoId) {
            trigger("vehiculo");
        }
    }

    const handleCreate = async (formData: CreateViajeSchema) => {
        try {
            await viajeControllerCreate(formData as CreateViajeSchema);
            notify("create");
            navigate("/trips");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleUpdate = async (formData: UpdateViajeSchema) => {
        try {
            const {_id, ...dataToUpdate} = formData;
            
            await viajeControllerUpdate(id!, dataToUpdate as UpdateViajeSchema);
            notify("update");
            navigate("/trips");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const onSubmit = async (formData: CreateViajeSchema | UpdateViajeSchema) => {
        console.log("Form Data:", formData);
        if (isEditing) {
        await handleUpdate(formData as UpdateViajeSchema);
        } else {
        await handleCreate(formData as CreateViajeSchema);
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
        companies,
        depots,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        loadingAuxData,
        filterByCompany,
        filteredChoferes,
        filteredVehiculos,
        handleSelectChofer,
        getValues,
        trigger,
        isSubmitting,
        setValue,
    }
}