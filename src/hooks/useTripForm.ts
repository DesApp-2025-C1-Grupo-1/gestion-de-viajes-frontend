import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { useViajeControllerFindOne, viajeControllerCreate, viajeControllerUpdate, CreateViajeDto, UpdateViajeDto, DepositoDto, useEmpresaControllerFindAll, useVehiculoControllerFindAll, useChoferControllerFindAll, useDepositoControllerFindAll} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateViajeSchema, UpdateViajeSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const useTripForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const {
        register,
        control,
        reset,
        handleSubmit,
        watch,
        trigger,
        formState: { errors: formErrors , isValid},
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

    // ⏱️ Forzar validación cruzada entre fechas
    const fecha_inicio = watch("fecha_inicio");
    const fecha_llegada = watch("fecha_llegada");

    useEffect(() => {
    if (fecha_inicio && fecha_llegada) {
        trigger("fecha_llegada");
    }
    }, [fecha_inicio, fecha_llegada]);

    // ⏱️ Forzar validación cruzada entre depósitos
    const deposito_origen = watch("deposito_origen");
    const deposito_destino = watch("deposito_destino");

    useEffect(() => {
    if (deposito_origen && deposito_destino) {
        trigger("deposito_destino");
    }
    }, [deposito_origen, deposito_destino]);

    const { data, isLoading, error } = useViajeControllerFindOne(id!, { query: { enabled: isEditing } });
    const { data: companies, error: errorCompanies, isLoading: loadingCompanies } = useEmpresaControllerFindAll();
    const { data: vehicles, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();
    const { data: drivers, error: errorDrivers, isLoading: loadingDrivers } = useChoferControllerFindAll();
    const { data: depots, error: errorDepots, isLoading: loadingDepots } = useDepositoControllerFindAll();
    const { notify } = useNotify("Viaje");

    useEffect(() => {
        if (isEditing && data && data.data) {
        const { _id, deposito_origen, deposito_destino, vehiculo, empresa, chofer, ...rest } = data.data ;
        const { _id: idDepoOrigen} = deposito_origen;
        const { _id: idDepoDestino} = deposito_destino;
        const { _id: idVehiculo} = vehiculo;
        const { _id: idEmpresa} = empresa;
        const { _id: idChofer} = chofer;
        reset({
            ...rest,
            _id,
            deposito_origen: idDepoOrigen,
            deposito_destino: idDepoDestino,
            vehiculo: idVehiculo,
            empresa: idEmpresa,
            chofer: idChofer
        } as CreateViajeSchema);
        }
    }, [isEditing, data]);

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
        vehicles,
        drivers,
        depots,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        loadingAuxData: loadingCompanies || loadingDrivers || loadingVehicles || errorDepots
    }
}