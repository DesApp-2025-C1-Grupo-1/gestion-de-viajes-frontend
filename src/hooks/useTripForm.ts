import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { useViajeControllerFindOne, viajeControllerCreate, viajeControllerUpdate, CreateViajeDto, UpdateViajeDto, DepositoDto, useEmpresaControllerFindAll, useVehiculoControllerFindAll, useChoferControllerFindAll, useDepositoControllerFindAll, VehiculoDto, ChoferDto} from "../api/generated";
import { useForm } from "react-hook-form";
import { CreateViajeSchema, UpdateViajeSchema } from "../api/schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const useTripForm = (id?: string) => {
    const navigate = useNavigate();
    const isEditing = !!id;
    const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoDto[]>([]);
    const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>([]);
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

    const deposito_origen = watch("deposito_origen");
    const deposito_destino = watch("deposito_destino");
    

    useEffect(() => {
        if (deposito_origen && deposito_destino && deposito_origen !== "" && deposito_destino !== "") {
            
            trigger("deposito_destino"); // <-- Valida todo el formulario
        }
    }, [deposito_origen, deposito_destino]);

    const fecha_inicio = watch("fecha_inicio");
    const fecha_llegada = watch("fecha_llegada");
    // Validaciones cruzadas
    useEffect(() => {
        if (fecha_llegada && fecha_inicio) {
            trigger("fecha_llegada")
        }
        
    }, [fecha_llegada, fecha_inicio, trigger]);

    

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


    const handleSelectCompany = (companyId: string) => {
        if (!companyId) {
            setFilteredVehiculos(vehicles?.data || []);
            setFilteredChoferes(drivers?.data || []);
            return;
        }
        const filteredVehicles = vehicles?.data.filter(vehicle => vehicle.empresa._id === companyId) || [];
        const filteredDrivers = drivers?.data.filter(driver => driver.empresa._id === companyId) || [];
        setFilteredVehiculos(filteredVehicles);
        setFilteredChoferes(filteredDrivers);

        // Si el vehículo actual no está en la lista filtrada, limpiar el campo
        const currentVehicleId = control._formValues.vehiculo;
        if (currentVehicleId && !filteredVehicles.some(vehicle => vehicle._id === currentVehicleId)) {
            resetField("vehiculo");
        }
        // Si el chofer actual no está en la lista filtrada, limpiar el campo
        const currentDriverId = control._formValues.chofer;
        if (currentDriverId && !filteredDrivers.some(driver => driver._id === currentDriverId)) {
            resetField("chofer");
        }
    }

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
        loadingAuxData: loadingCompanies || loadingDrivers || loadingVehicles || loadingDepots,
        handleSelectCompany,
        filteredChoferes,
        filteredVehiculos,
        handleSelectChofer,
        getValues,
        trigger,
    }
}