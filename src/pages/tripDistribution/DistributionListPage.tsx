import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";

export default function DistributionListPage() {
  const navigate = useNavigate();

  return <>
    <SectionHeader 
      title="Viajes de distribución" 
      description="Gestione y planifique viajes de distribución asociando remitos, costos y recursos de transporte."
      buttonText="Nuevo viaje"
      onAdd={() => navigate('/trips/distribution/form')}
    />
  
  </>;
}