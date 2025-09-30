import { SectionHeader } from "../../components/SectionHeader";
import { Paper, Box, CircularProgress, Alert } from "@mui/material";
import { useEditDistributionForm } from "../../hooks/tripDistribution/useEditDistributionForm";
import { DistributionForm } from "./DistributionForm";
import { TripStateProgress } from "./TripStateProgrees";

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
        <Box sx={{ mb: 4 }}>
          <TripStateProgress 
            currentState={form.tripData?.estado}
            // onStateClick={form.stateManager?.changeState} // Si implementas stateManager
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