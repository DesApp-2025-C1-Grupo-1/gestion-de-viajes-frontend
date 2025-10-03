// hooks/tripDistribution/utils.ts
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";
import { ChoferDto, TipoVehiculoDtoLicenciaPermitida, VehiculoDto } from "../../api/generated";
import { isValidateLicense } from "../../services/validateLicense";
import { TripEstado } from "./types";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";

// Validación de permisos de edición según estado del viaje
export const validateEditPermissions = (
  currentEstado: TripEstado | undefined, 
  formData: any
): string | null => {
  if (!currentEstado) return null;

  const permissions = {
    'iniciado': true, // Todo editable
    'inicio de carga': false, // Nada editable
    'fin de carga': false, // Nada editable  
    'fin de viaje': false // Nada editable
  };

  if (!permissions[currentEstado]) {
    return `No se puede editar el viaje en estado "${currentEstado}"`;
  }

  return null;
};

// Validación de compatibilidad chofer-vehículo
export const validateDriverVehicleCompatibility = (
  vehiculoId: string, 
  choferId: string, 
  vehiculos: VehiculoDto[], 
  choferes: ChoferDto[],
  setError: UseFormSetError<CreateViajeDistribucionSchema>,
  clearErrors: UseFormClearErrors<CreateViajeDistribucionSchema>
) => {
  if (!vehiculoId || !choferId) return false;

  const selectedVehicle = vehiculos.find(v => v._id === vehiculoId);
  const selectedChofer = choferes.find(v => v._id === choferId);
      
  if (!selectedVehicle) {
      // lo puse para que no sea undefined 
      setError("vehiculo", {
      type: "manual",
      message: "Vehículo inválido",
      });
      return false;
  }

  if (!selectedChofer) {
      setError("chofer", {
      type: "manual",
      message: "Chofer inválido",
      });
      return false;
  }
  const licenciasCompatibles = selectedVehicle.tipo.licencia_permitida as TipoVehiculoDtoLicenciaPermitida; 

  if (!isValidateLicense(selectedChofer.tipo_licencia, licenciasCompatibles)) {
      setError("vehiculo", {
      type: "manual",
      message: `La licencia ${selectedChofer.tipo_licencia} no es válida para este tipo de vehículo`,
      });

      return false;
  }
  clearErrors("chofer");
  clearErrors("vehiculo");

  return true;

};

// Mapear datos del viaje a valores del form
export const mapTripToFormValues = (tripData: any) => {
  if (!tripData) return {};

  return {
    fecha_inicio: tripData.fecha_inicio ? new Date(tripData.fecha_inicio) : undefined,
    transportista: tripData.transportista?._id || "",
    origen: tripData.origen?._id || "",
    chofer: tripData.chofer?._id || "",
    vehiculo: tripData.vehiculo?._id || "",
    tipo_viaje: tripData.tipo_viaje || "nacional",
    kilometros: tripData.kilometros || 0,
    remito_ids: tripData.remitos?.map((r: any) => r._id) || [],
    tarifa_id: tripData.tarifa?._id || undefined,
    estado: tripData.estado || undefined,
    observaciones: tripData.observaciones || "",
  };
};

// Manejo de errores de API
export const handleApiError = (error: any, notify: any) => {
  const message = error.response?.data?.message || "Error desconocido";
  notify("error", message);
};