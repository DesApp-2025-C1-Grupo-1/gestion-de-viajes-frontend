import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { TipoVehiculoDtoLicenciaPermitida} from "../api/generated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTripAuxData from "./trip/useTripAuxData";
import { isValidateLicense } from "../services/validateLicense";
import { CreateViajeDistribucionSchema, UpdateViajeDistribucionSchema, ViajeDistribucionSchema } from "../api/schemas/viajeDistribucion.schema";
import { useState } from "react";


export const useTripDistributionForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    const { notify } = useNotify("Viaje");
    const [typeOfVehicleId, setTypeOfVehicleId] =  useState<string>("");

    const {
        register,
        control,
        handleSubmit,
        trigger,
        resetField,
        clearErrors,
        setError,
        setValue,
        formState: { isLoading,errors: formErrors , isValid,isSubmitting},
    } = useForm<CreateViajeDistribucionSchema>({
        resolver: zodResolver(CreateViajeDistribucionSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            fecha_inicio: undefined,
            empresa: "",
            deposito_origen: "",
            chofer: "",
            vehiculo: "",
            tipo_viaje: "nacional",
            kilometros_camion: 0,
            remitos: [],
        },
    });
    
/*     // 1. Cargar viaje si estamos editando
    const {isLoading,error} = useTripData(id, reset); */
    
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
        filterByCompany
    } = useTripAuxData({control, resetField});
    

    const handleSelectChofer = (choferId: string) => {
        if (!choferId) {
            setValue("vehiculo", "", { shouldValidate: true });
            return;
        }

        const selectedChofer = filteredChoferes.find(chofer => chofer._id === choferId);
        const vehiculoId = selectedChofer?.vehiculo?._id || "";
        
        setValue("vehiculo", vehiculoId, { shouldValidate: true });
        setTypeOfVehicleId(filteredVehiculos?.find(veh => veh._id === vehiculoId)?.tipo._id || "");
        
        // Opcional: Forzar validación cruzada
        if (vehiculoId) {
            trigger("vehiculo");
        }
    }

    const handleCreate = async (formData: CreateViajeDistribucionSchema) => {
        try {
            /* await viajeControllerCreate(formData as CreateViajeDistribucionSchema); */
            notify("create");
            navigate("/trips/distribution");
        } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleUpdate = async (formData: UpdateViajeDistribucionSchema) => {
        /* try {
            const {_id, ...dataToUpdate} = formData;
            
            await viajeControllerUpdate(id!, dataToUpdate as UpdateViajeDistribucionSchema);
            notify("update");
            navigate("/trips");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        } */
    };

    const onSubmit = async (formData: CreateViajeDistribucionSchema | UpdateViajeDistribucionSchema) => {
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
            await handleUpdate(formData as  UpdateViajeDistribucionSchema);
        } else {
            await handleCreate(formData as CreateViajeDistribucionSchema);
            
        }
    };

    return{
        handleSubmit,
        onSubmit,
        isEditing,
        formErrors,
        control,
        companies, 
        clearErrors,
        depots,
        isSubmitting,
        setError,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        isLoading,
        filteredChoferes,
        filteredVehiculos,
        filterByCompany,
        handleSelectChofer,
        register,
        setValue,
        typeOfVehicleId,
        setTypeOfVehicleId
    }
}