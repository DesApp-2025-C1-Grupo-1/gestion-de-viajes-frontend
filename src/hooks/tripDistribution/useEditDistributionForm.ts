import { useEffect } from "react";
import { useDistributionFormBase } from "./useDistributionFormBase";
import { useDistributionAuxData } from "./useDistributionAuxData";
import { useTripDistributionData } from "./useTripDistributionData";
import { viajeDistribucionControllerUpdate } from "../../api/generated";
import { useNotify } from "../useNotify";
import { useNavigate } from "react-router-dom";
import { handleApiError, validateDriverVehicleCompatibility, mapTripToFormValues } from "./utils";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";

export const useEditDistributionForm = (tripId: string) => {
  const navigate = useNavigate();
  const { notify } = useNotify("Viaje");
   // Cargar datos del viaje existente
  const { data: tripData, isLoading, error } = useTripDistributionData(tripId);

  // Form con valores del viaje
  const form = useDistributionFormBase(
    tripData ? mapTripToFormValues(tripData) : undefined
  );

  const { setValue, setError, control, clearErrors, reset } = form;

  useEffect(() => {
    if (tripData && reset) {
      console.log('🔄 Reseteando formulario con datos del viaje. Tipo viaje:', tripData.tipo_viaje);

      reset({
          ...tripData,
          fecha_inicio: tripData.fecha_inicio ? new Date(tripData.fecha_inicio) : undefined,
          origen: tripData.origen._id,
          vehiculo: tripData.vehiculo._id,
          transportista: tripData.transportista._id,
          chofer: tripData.chofer._id,
          remito_ids: tripData.remito_ids ?? [],
          kilometros: tripData.kilometros ?? 0,
          tarifa_id: tripData.tarifa_id,
          estado: tripData.estado,
          tipo_viaje: tripData.tipo_viaje === "nacional" || tripData.tipo_viaje === "internacional"
            ? tripData.tipo_viaje
            : undefined,
        });
    }
  }, [tripData, reset]);

  // Datos auxiliares
  const auxData = useDistributionAuxData({ control , setValue, initialCompanyId: tripData?.transportista._id});
  const { filteredVehiculos, filteredChoferes} = auxData;

  const onSubmit = async (formData: CreateViajeDistribucionSchema) => {
    // Validar permisos de edición según estado
    // Validación de licencia (compartida)
    
    const isValid = validateDriverVehicleCompatibility(
      formData.vehiculo, 
      formData.chofer, 
      filteredVehiculos, 
      filteredChoferes,
      setError, 
      clearErrors
    );

    if (!isValid) return;

    // 2. Validación de tarifa para viajes nacionales
    const esInternacional = formData.tipo_viaje === 'internacional';
    if (!esInternacional && !formData.tarifa_id) {
      setError('tarifa_id', {
        type: 'manual',
        message: 'La tarifa es obligatoria para viajes nacionales'
      });
      return;
    }

    // 3. Validación de remitos
    if (!formData.remito_ids || formData.remito_ids.length === 0) {
      setError('remito_ids', {
        type: 'manual', 
        message: 'Debe seleccionar al menos un remito'
      });
      return;
    }

    try {
      const { fecha_inicio, ...dataToUpdate } = formData;
      await viajeDistribucionControllerUpdate(tripId, dataToUpdate);
      notify("update");
      navigate("/trips/distribution");
    } catch (e) {
      handleApiError(e, notify);
    }
  };

  return {
    form,
    onSubmit,
    isEditing: true,
    isSubmitting: form.formState.isSubmitting,
    isLoading,
    error,
    tripData,
    ...auxData
  };
};