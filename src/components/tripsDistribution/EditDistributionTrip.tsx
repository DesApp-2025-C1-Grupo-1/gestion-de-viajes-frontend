import { SectionHeader } from "../../components/SectionHeader";
import { Paper, Box, CircularProgress, Alert } from "@mui/material";
import { useEditDistributionForm } from "../../hooks/tripDistribution/useEditDistributionForm";
import { DistributionForm } from "./DistributionForm";
import { TripStateProgress } from "./TripStateProgrees";
import { ViajeDistribucionDtoEstado } from "../../api/generated";
import { TripStateActions } from "./sections/TripStateActions";

interface EditDistributionFormProps {
  tripId: string;
}

export default function EditDistributionForm({ tripId }: EditDistributionFormProps) {
  const form = useEditDistributionForm(tripId);

  if (form.isLoading || form.loadingAuxData || !form.tripData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (form.error) {
    return (
      <Alert severity="error">
        Error al cargar el viaje: {form.error.message}
      </Alert>
    );
  }

  if (!form.tripData) {
    return (
      <Alert severity="warning">
        Viaje no encontrado
      </Alert>
    );
  }

  // NUEVA: Función para manejar cambios de estado
  const handleStateChange = async (nuevoEstado: string) => {
    try {
      console.log(`🔄 Cambiando estado de "${form.tripData?.estado}" a "${nuevoEstado}"`);
      
      // Actualizar en el formulario
      form.form.setValue('estado', nuevoEstado as ViajeDistribucionDtoEstado);
      
      // Mostrar confirmación basada en el estado
      const confirmMessages: Record<string, string> = {
        'inicio de carga': '¿Confirmar inicio de carga?',
        'fin de carga': '¿Confirmar fin de carga?', 
        'fin de viaje': '¿Confirmar fin del viaje?'
      };
      
      const message = confirmMessages[nuevoEstado];
      if (message && window.confirm(message)) {
        // Aquí podrías hacer la llamada a la API para actualizar el estado
        // await actualizarEstadoViaje(tripId, nuevoEstado);
        
        console.log(`✅ Estado cambiado a: ${nuevoEstado}`);
        
        // Opcional: Recargar datos o mostrar mensaje de éxito
        // form.form.handleSubmit(form.onSubmit)();
      }
      
    } catch (error) {
      console.error('Error cambiando estado:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  return (
    <>
      <SectionHeader 
        title="Editar Viaje de Distribución"
        description="Actualizá los datos del viaje de distribución registrado."
      />
      
      <Paper sx={{ 
        padding: 4, 
        mx: 'auto', 
        width: "100%", 
        borderRadius: 2, 
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", 
        border: "1px solid #C7C7C7" 
      }}>
        {/* Progreso de estados - Solo en edición */}
        <Box sx={{ mb: 4,  bgcolor: 'background.default', borderRadius: 2 }}>
          <TripStateProgress currentState={form.tripData?.estado} />
          
          <TripStateActions 
            currentState={form.tripData?.estado}
            onStateChange={handleStateChange}
            tripData={form.tripData}
          />
        </Box>

        <DistributionForm 
          form={form}
          isEditing={true}
          tripData={form.tripData}
        />
      </Paper>
    </>
  );
}