import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotify } from "./useNotify";
import { CreateChoferDto, choferControllerCreate, UpdateChoferDto, useChoferControllerFindOne, choferControllerUpdate, useEmpresaControllerFindAll, useVehiculoControllerFindAll, VehiculoDto, TipoVehiculoDtoLicenciaPermitida } from '../api/generated';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";;
import { CreateChoferSchema, UpdateChoferSchema, createChoferSchema} from '../api/schemas/chofer.schema';
import { tipoLicenciaSchema } from "../api/schemas/enums/tipoLicencia.schema";

const licenciasCompatiblesMap: { [key: string]: string[] } = {
  'A1.1': ['A1.1'],
  'A1.2': ['A1.2', 'A1.1'],
  'A1.3': ['A1.3', 'A1.2', 'A1.1'],
  'A1.4': ['A1.4', 'A1.3', 'A1.2', 'A1.1'],

  'A2.1': ['A2.1'],
  'A2.2': ['A2.2', 'A2.1'],

  A3: ['A3'],

  B1: ['B1', 'A3'],
  B2: ['B2', 'B1'],

  C1: ['C1', 'B1'],
  C2: ['C2', 'C1', 'B1'],
  C3: ['C3', 'C2', 'C1', 'B1'],

  D1: ['D1', 'B1'],
  D2: ['D2', 'D1', 'B1'],
  D3: ['D3', 'D2', 'D1', 'B1'],

  E1: ['E1', 'B2', 'C1', 'C2', 'C3'],
  E2: ['E2'],

  F: ['F'],
  G1: ['G1'],
  G2: ['G2'],
};

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

  function getLicenciasCompatibles(tipoLicencia: string): string[] {
    const licenciasCompatibles = licenciasCompatiblesMap[tipoLicencia];

    if (!licenciasCompatibles) return [];
    // Retorna las licencias compatibles para el tipo de licencia dado
    // Si no hay licencias compatibles, retorna un array vacío
    return licenciasCompatibles;
  }

  const isValidateLicense = (tipoLicencia: string, vehicleRequiredLicenses: string) => {
    if (!tipoLicencia || !vehicleRequiredLicenses || vehicleRequiredLicenses.length === 0) {
      if (vehicleRequiredLicenses.length === 0) return true;
      return false;
    }

    const driverCanDriveLicenses = getLicenciasCompatibles(tipoLicencia);

    const esCompatible = driverCanDriveLicenses.some((license) =>
      license === vehicleRequiredLicenses,
    );

    return esCompatible
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
    // Actualizar que ya no recibira un array, sino un string.
    //const licenciasCompatibles = selectedVehicle.tipo.licencias_permitidas as TipoVehiculoDtoLicenciasPermitidasItem; 
    
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
      //console.log("payload final", JSON.stringify(payload, null, 2));
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
