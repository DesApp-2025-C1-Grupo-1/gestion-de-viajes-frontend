import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, useEmpresaControllerFindAll, useVehiculoControllerFindAll, VehiculoDto, TipoVehiculoDtoLicenciaPermitida } from '../api/generated';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";;
import { CreateChoferSchema, UpdateChoferSchema, createChoferSchema} from '../api/schemas/chofer.schema';
import { tipoLicenciaSchema } from "../api/schemas/enums/tipoLicencia.schema";
import { isValidateLicense } from "../services/validateLicense";
import { useQueryClient } from "@tanstack/react-query";



export const useDriverForm = (id?: string) => {
  const navigate = useNavigate();
  const isEditing = !!id;
  const queryClient =  useQueryClient();
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

  const { notify } = useNotify("Chofer", "male");

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
    
      const currentVehicles : VehiculoDto[] = vehiculos?.data?.filter(v => v.empresa._id === idEmpresa) || [];
      setFilteredVehicles(currentVehicles); // Inicializar vehículos filtrados con todos los vehículos disponibles
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
    const selectedVehicle = vehiculos?.data?.find(v => v._id === FormData.vehiculo);
    
    if (!selectedVehicle) {
      // lo puse para que no sea undefined 
      setError("vehiculo", {
        type: "manual",
        message: "Vehículo inválido",
      });
      return;
    }
    const licenciasCompatibles = selectedVehicle.tipo.licencia_permitida as TipoVehiculoDtoLicenciaPermitida; 
    
    if (!isValidateLicense(FormData.tipo_licencia, licenciasCompatibles)) {
      setError("vehiculo", {
        type: "manual",
        message: `La licencia ${FormData.tipo_licencia} no es válida para este tipo de vehículo`,
      });
      return;
    }
    clearErrors("licencia");
    clearErrors("vehiculo");

    if(isEditing){
      await handleUpdate(FormData as UpdateChoferSchema);
    }
    else{
      await handleCreate(FormData as CreateChoferSchema);
    }
  };

  const handleUpdate = async(FormData: UpdateChoferSchema) => {
    try{
      const {_id, ...dataToUpdate} = FormData;

      await choferControllerUpdate(id!, dataToUpdate as UpdateChoferDto);
      notify("update");
      await queryClient.invalidateQueries({ queryKey: ['/chofer'] });
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
        fecha_nacimiento: FormData.fecha_nacimiento,

        telefono: {
          codigo_pais: FormData.telefono.codigo_pais ?? "",
          codigo_area: FormData.telefono.codigo_area ?? "",
          numero: FormData.telefono.numero ?? "",
        },
      };

      await choferControllerCreate(payload);
      notify("create");
      await queryClient.invalidateQueries({ queryKey: ['/chofer'] });
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
