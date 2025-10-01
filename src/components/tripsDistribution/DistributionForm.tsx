import { useState } from "react";
import { DistributionFormContext } from "../../contexts/DistributionFormContext";
import { useTripPermissions } from "../../hooks/useTripPermissions";
import FormActions from "../deposit/FormActions";
import RemitosSection from "./sections/RemitosSection";
import ResourcesSection from "./sections/ResourcesSection";
import TariffSection from "./sections/TariffSection";
import TripDataSection from "./sections/TripDataSection";
import { Localidad, Provincia } from "../../hooks/useGeoref";
import { ViajeDistribucionDto, ViajeDistribucionDtoEstado } from "../../api/generated";
import { useWatch } from "react-hook-form";

interface DistributionFormProps {
  form: any;
  isEditing: boolean;
  tripData?: ViajeDistribucionDto;
}

export function DistributionForm({ form, isEditing, tripData }: DistributionFormProps) {
  const estado = useWatch<{ estado: ViajeDistribucionDtoEstado }>({ control: form.form.control, name: 'estado' });
  const permissions = useTripPermissions(estado || (tripData ? tripData.estado : "iniciado"));

  const [selectedPais, setSelectedPais] = useState<string>("");
  const [selectedProvincia, setSelectedProvincia] = useState<Provincia | null>(null);
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | null>(null);

  const contextValue = {
    form,
    permissions,
    tripData,
    isEditing,
    selectedPais,
    setSelectedPais,
    selectedProvincia,
    setSelectedProvincia,
    selectedLocalidad,
    setSelectedLocalidad,
  };
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await form.form.handleSubmit(form.onSubmit)(e);
  };

  return (
    <DistributionFormContext.Provider value={contextValue}>
      <form 
        onSubmit={handleFormSubmit} 
        className="w-full max-w-[800px] mx-auto"
      >
        
        <TripDataSection />
        <ResourcesSection />
        <RemitosSection />
        <TariffSection />
        
        <FormActions 
          isSubmitting={form.form.formState.isSubmitting}
          isEditing={isEditing}
          loading={form.isLoading}
        />

      </form>
    </DistributionFormContext.Provider>
  );
}