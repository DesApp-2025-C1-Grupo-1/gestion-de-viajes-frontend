import { SectionHeader } from "../../components/SectionHeader";
import { Paper} from "@mui/material";
import { useCreateDistributionForm } from "../../hooks/tripDistribution/useCreateDistributionForm";
import { DistributionForm } from "./DistributionForm";

export default function CreateDistributionTrip() {
  const form = useCreateDistributionForm();

  return (
    <>
      <SectionHeader 
        title="Registrar Viaje de Distribución"
        description="Completá el formulario para dar de alta un viaje de distribución."
      />
      
      <Paper sx={{ 
        padding: 4, 
        mx: 'auto', 
        width: "100%", 
        borderRadius: 2, 
        boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", 
        border: "1px solid #C7C7C7" 
      }}>
        <DistributionForm 
          form={form}
          isEditing={false}
        />
      </Paper>

    </>
  );
}