import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { TipoVehiculoDtoLicenciaPermitida, viajeControllerCreate, viajeControllerUpdate} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateViajeSchema, UpdateViajeSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTripData } from "./trip/useTripData";
import useTripAuxData from "./trip/useTripAuxData";
import useCrossFieldValidation  from "./trip/useCrossFieldValidation";
import { isValidateLicense } from "../services/validateLicense";

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
        clearErrors,
        setError,
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
    } = useTripAuxData({control, resetField, companyName: "empresa"});
    
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
        const selectedVehicle = filteredVehiculos.find(v => v._id === formData.vehiculo);
        const selectedChofer = filteredChoferes.find(v => v._id === formData.chofer);
            
        if (!selectedVehicle) {
            // lo puse para que no sea undefined 
            setError("vehiculo", {
            type: "manual",
            message: "Vehículo inválido",
            });
            return;
        }

        if (!selectedChofer) {
            setError("chofer", {
            type: "manual",
            message: "Chofer inválido",
            });
            return;
        }
        const licenciasCompatibles = selectedVehicle.tipo.licencia_permitida as TipoVehiculoDtoLicenciaPermitida; 
        // Actualizar que ya no recibira un array, sino un string.
        //const licenciasCompatibles = selectedVehicle.tipo.licencias_permitidas as TipoVehiculoDtoLicenciasPermitidasItem; 
        
        if (!isValidateLicense(selectedChofer.tipo_licencia, licenciasCompatibles)) {
            setError("vehiculo", {
            type: "manual",
            message: `La licencia ${selectedChofer.tipo_licencia} no es válida para este tipo de vehículo`,
            });
            return;
        }
        clearErrors("chofer");
        clearErrors("vehiculo");


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