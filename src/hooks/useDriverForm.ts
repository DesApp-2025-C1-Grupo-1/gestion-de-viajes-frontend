import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, useEmpresaControllerFindAll, useVehiculoControllerFindAll, VehiculoDto, TipoVehiculoDtoLicenciasPermitidasItem } from '../api/generated';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";;
import { CreateChoferSchema, UpdateChoferSchema, createChoferSchema} from '../api/schemas/chofer.schema';
import { tipoLicenciaSchema } from "../api/schemas/enums/tipoLicencia.schema";

export const useDriverForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const licenciasValidas = Object.values(tipoLicenciaSchema.enum);
  const [filteredVehicles, setFilteredVehicles] = useState<VehiculoDto[]>([]);

  const {
    register,
    control,
    reset,
    handleSubmit,
    watch,
    resetField,
    trigger,
    setError,
    clearErrors,
    formState: { errors: formErrors , isValid,isSubmitting},
  } = useForm<CreateChoferSchema>({
    resolver: zodResolver(createChoferSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: undefined,

      fecha_nacimiento: undefined,

      licencia: "",
      tipo_licencia: licenciasValidas[0],
      telefono: {
        codigo_pais: "",
        codigo_area: "",
        numero: ""
      },
      email: "",
      empresa: "",
      vehiculo: "",
    },
  })

  const { data, isLoading, error } = useChoferControllerFindOne(id!, { query: { enabled: isEditing } });
  const { data: companies, error: errorEmpresa, isLoading: loadingEmpresas } = useEmpresaControllerFindAll();
  const { data: vehiculos, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();

  const { notify } = useNotify("Chofer");

  useEffect(() => {
    if (isEditing && data && data.data) {
      const { _id, empresa, vehiculo, fecha_nacimiento, ...rest } = data.data ;
      const {_id: idVehiculo} = vehiculo;
      const {_id: idEmpresa} = empresa;
      reset({
        ...rest,
        fecha_nacimiento: new Date(fecha_nacimiento),
        _id,
        vehiculo: idVehiculo,
        empresa: idEmpresa,
      } as CreateChoferSchema);
    }
  }, [isEditing, data]);

    const fecha_nacimiento = watch("fecha_nacimiento");

    useEffect(() => {
    if (fecha_nacimiento ) {
        trigger("fecha_nacimiento");
    }
    }, [fecha_nacimiento]);

  // Filtrar vehículos cuando se selecciona una empresa
  const handleCompanyChange = (companyId: string) => {
    if (!companyId) {
      setFilteredVehicles(vehiculos?.data || []); // Si no hay empresa seleccionada, mostrar todos
      return;
    }
    const filtered = vehiculos?.data?.filter(
      (vehicle) => vehicle.empresa?._id === companyId
    ) || [];
    setFilteredVehicles(filtered);

    const currentVehicleId = control._formValues.vehiculo;
    // Si el vehículo actual no está en la lista filtrada, limpiar el campo
    if (currentVehicleId) {
      const currentVehicle = vehiculos?.data?.find(v => v._id === currentVehicleId);
      if (currentVehicle?.empresa?._id !== companyId) {
        resetField("vehiculo"); // Limpiar el campo vehiculo si no pertenece a la empresa seleccionada
      }
    }
  };

  const onSubmit = async(FormData: CreateChoferSchema | UpdateChoferSchema) => {
    console.log("Datos del formulario:", data);
    const selectedVehicle = vehiculos?.data?.find(v => v._id === FormData.vehiculo);
    
    if (!selectedVehicle) {
      // lo puse para que no sea undefined pero nose
      setError("vehiculo", {
        type: "manual",
        message: "Vehículo inválido",
      });
      return;
    }
    const licenciasCompatibles = selectedVehicle.tipo.licencias_permitidas; 
    
    if (!licenciasCompatibles.includes(FormData.licencia as TipoVehiculoDtoLicenciasPermitidasItem)) {
      setError("vehiculo", {
        type: "manual",
        message: `El vehículo seleccionado no es compatible con la licencia ${FormData.tipo_licencia}`,
      });
    }
    clearErrors("licencia");
    clearErrors("vehiculo");

    if(isEditing){
      await handleUpdate(FormData as UpdateChoferSchema);
    }
    else{
      console.log(FormData)
      await handleCreate(FormData as CreateChoferSchema);
    }
  };

  const handleUpdate = async(FormData: UpdateChoferSchema) => {
    try{
      const {_id, ...dataToUpdate} = FormData;

      await choferControllerUpdate(id!, dataToUpdate as UpdateChoferDto);
      notify("update");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  const handleCreate = async(FormData: CreateChoferSchema) => {
    try{
      const payload: CreateChoferDto = {
        ...FormData,
        fecha_nacimiento: FormData.fecha_nacimiento.toISOString(),

        telefono: {
          codigo_pais: FormData.telefono.codigo_pais ?? "",
          codigo_area: FormData.telefono.codigo_area ?? "",
          numero: FormData.telefono.numero ?? "",
        },
      };

      console.log("payload final", JSON.stringify(payload, null, 2));
      
      await choferControllerCreate(payload);
      notify("create");
      navigate("/drivers");
    } catch(e) {
      const error = e as {response?: {data?: {message?: string}}};
      if(error.response?.data?.message){
        notify("error", error.response.data.message);
      }
    }
  };

  return{
    onSubmit, handleSubmit, handleCreate, handleUpdate, isEditing, formErrors, register, control, isValid, reset, isLoading, error, companies, filteredVehicles, errorEmpresa, errorVehicles, licenciasValidas, watch, loadingAuxData: loadingEmpresas || loadingVehicles, handleCompanyChange,isSubmitting,
  }
}
