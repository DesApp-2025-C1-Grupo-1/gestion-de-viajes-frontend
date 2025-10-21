// hooks/tripDistribution/useCreateDistributionForm.ts
import { useNavigate } from "react-router-dom";
import { useNotify } from "../useNotify";
import { viajeDistribucionControllerCreate } from "../../api/generated";
import { useDistributionFormBase } from "./useDistributionFormBase";
import { useDistributionAuxData } from "./useDistributionAuxData";
import { handleApiError, validateDriverVehicleCompatibility } from "./utils";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";
import { useQueryClient } from "@tanstack/react-query";

export const useCreateDistributionForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notify } = useNotify("Viaje");
  
  // Form base sin lógica de edición
  const form = useDistributionFormBase();
  const { setValue, trigger, setError, clearErrors, control } = form;


  // Datos auxiliares (compartido pero simplificado)
  const auxData = useDistributionAuxData({ control , setValue});
  const { filteredVehiculos, filteredChoferes } = auxData;

  const onSubmit = async (formData: CreateViajeDistribucionSchema) => {
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
      const payload = {
        ...formData,
        fecha_inicio: formData.fecha_inicio,
        tarifa_id: formData.tarifa_id ?? undefined,
      };
      
      await viajeDistribucionControllerCreate(payload);
      notify("create");
      queryClient.invalidateQueries({ queryKey: ['/viaje-distribucion'] });
      navigate("/trips/distribution");
    } catch (e) {
      handleApiError(e, notify);
    }
  };

  return {
    form,
    onSubmit,
    isEditing: false,
    isSubmitting: form.formState.isSubmitting,
    ...auxData
  };
};
