import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { TipoVehiculoDtoLicenciaPermitida, viajeDistribucionControllerCreate, viajeDistribucionControllerUpdate} from "../api/generated";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTripAuxData from "./trip/useTripAuxData";
import { isValidateLicense } from "../services/validateLicense";
import { CreateViajeDistribucionSchema, UpdateViajeDistribucionSchema } from "../api/schemas/viajeDistribucion.schema";
import { useState } from "react";
//import { useTripDistributionData } from "./tripDistribution/useTripDistributionData";
import { useTripDistributionData } from "./trip/useTripData";
import { number } from "zod";


export const useTripDistributionForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    const { notify } = useNotify("Viaje");
    const [typeOfVehicleId, setTypeOfVehicleId] =  useState<string>("");

    const {
        register,
        control,
        reset,
        handleSubmit,
        trigger,
        resetField,
        clearErrors,
        setError,
        setValue,
        formState: { errors: formErrors, isSubmitting},
    } = useForm<CreateViajeDistribucionSchema>({
        resolver: zodResolver(CreateViajeDistribucionSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: {
            fecha_inicio: undefined,
            transportista: "",
            origen: "",
            chofer: "",
            vehiculo: "",
            tipo_viaje: "nacional",
            kilometros: 0,
            remito_ids: [],
            observaciones: "",
            tarifa_id: undefined,
            estado: "",
        },
    });

    //1. Cargar viaje si estamos editando
    const {isLoading, error} = useTripDistributionData(id, reset);
    
    // 1. Cargar viaje si estamos editando
    //const {isLoading ,error: errorLoading} = useTripDistributionData(id, reset);
    
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
    } = useTripAuxData({control, resetField, companyName: "transportista"});
    

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

/*    
    const handleCreate = async (formData: CreateViajeDistribucionSchema) => {
        try {
            const payload = {
            ...formData,
            fecha_inicio: formData.fecha_inicio.toISOString(),
            tarifa_id: formData.tarifa_id ?? 0,
            };

            await viajeDistribucionControllerCreate(payload);
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
        try {
            //const {id, fecha_inicio, ...dataToUpdate} = formData;
            const { id, fecha_inicio, ...rest } = formData;

            const dataToUpdate = {
                ...rest,
                fecha_inicio: fecha_inicio.toISOString(), 
            };
    
            await viajeDistribucionControllerUpdate(id!, dataToUpdate);
            //await viajeDistribucionControllerUpdate(id!, dataToUpdate as UpdateViajeDistribucionSchema);

            notify("update");
            navigate("/trips/distribution");
            } catch (e) {
            const error = e as { response?: { data?: { message?: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };*/

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
            //await handleUpdate(formData as  UpdateViajeDistribucionSchema);
        } else {
            //await handleCreate(formData as CreateViajeDistribucionSchema);
            
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