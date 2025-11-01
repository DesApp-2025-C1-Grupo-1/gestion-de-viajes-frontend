import { useEffect, useState } from "react";
import { useWatch, Control, UseFormSetValue} from "react-hook-form";
import {
    useEmpresaControllerFindAll,
    useVehiculoControllerFindAll,
    useChoferControllerFindAll,
    useDepositoControllerFindAll,
    VehiculoDto,
    ChoferDto
} from "../../api/generated";

interface UseDistributionAuxDataProps {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  initialCompanyId?: string;
}

export const useDistributionAuxData = ({ control, setValue, initialCompanyId }: UseDistributionAuxDataProps) => {
  const [typeOfVehicleId, setTypeOfVehicleId] = useState<string>("");
  const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoDto[]>([]);
  const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>([]);

  // Datos de la API
  const { data: companies, error: errorCompanies, isLoading: loadingCompanies } = useEmpresaControllerFindAll();
  const { data: vehicles, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();
  const { data: drivers, error: errorDrivers, isLoading: loadingDrivers } = useChoferControllerFindAll();
  const { data: depots, error: errorDepots, isLoading: loadingDepots } = useDepositoControllerFindAll();

  // Watch form values
  const companyIdTrip = useWatch({ control, name: "transportista" });
  const currentDriverId = useWatch({ control, name: "chofer" });
  const currentVehicleId = useWatch({ control, name: "vehiculo" });

  // Filtrar vehículos y choferes por empresa
  useEffect(() => {
    const companyId = companyIdTrip || initialCompanyId;
    
    if (companyId && vehicles?.data && drivers?.data) {
      const filteredVehicles = vehicles.data.filter(v => v.empresa?._id === companyId);
      const filteredDrivers = drivers.data.filter(d => d.empresa?._id === companyId);
      
      setFilteredVehiculos(filteredVehicles);
      setFilteredChoferes(filteredDrivers);

      // Resetear selecciones si ya no pertenecen a la empresa
      if (currentVehicleId && !filteredVehicles.some(v => v?._id === currentVehicleId)) {
        setValue("vehiculo", "");
      }
      if (currentDriverId && !filteredDrivers.some(d => d?._id === currentDriverId)) {
        setValue("chofer", "");
      }
    } else {
      setFilteredVehiculos(vehicles?.data || []);
      setFilteredChoferes(drivers?.data || []);
    }
  }, [companyIdTrip, initialCompanyId, vehicles?.data, drivers?.data, currentVehicleId, currentDriverId, control]);

  useEffect(() => {
    if (currentVehicleId && filteredVehiculos.length > 0) {
      const selectedVehicle = filteredVehiculos.find(veh => veh._id === currentVehicleId);
      const vehicleTypeId = selectedVehicle?.tipo?._id || "";
      
      if (vehicleTypeId && vehicleTypeId !== typeOfVehicleId) {
        setTypeOfVehicleId(vehicleTypeId);
      }
    } else if (!currentVehicleId && typeOfVehicleId) {
      // Si no hay vehículo seleccionado, limpiar typeOfVehicleId
      setTypeOfVehicleId("");
    }
  }, [currentVehicleId, filteredVehiculos, typeOfVehicleId]);

  const filterByCompany = (companyId?: string) => {
    setValue("transportista", companyId || "");
  };

  const handleSelectChofer = (choferId: string) => {
    if (!choferId) {
      setValue("vehiculo", "");
      setTypeOfVehicleId("");
      return;
    }

    const selectedChofer = filteredChoferes.find(chofer => chofer._id === choferId);
    const vehiculoId = selectedChofer?.vehiculo?._id || "";

    setValue("vehiculo", vehiculoId);

    const vehicleTypeId = filteredVehiculos.find(veh => veh._id === vehiculoId)?.tipo._id || "";
    setTypeOfVehicleId(vehicleTypeId);
  };

  return {
    // Datos de la API
    companies: companies?.data || [],
    depots: depots?.data || [],
    vehicles: vehicles?.data || [],
    drivers: drivers?.data || [],
    
    // Estados filtrados
    filteredVehiculos,
    filteredChoferes,
    
    // Errores
    errorCompanies,
    errorVehicles, 
    errorDrivers,
    errorDepots,
    
    // Loading
    loadingAuxData: loadingCompanies || loadingVehicles || loadingDrivers || loadingDepots,
    
    // Funciones
    filterByCompany,
    handleSelectChofer,
    typeOfVehicleId,
    setTypeOfVehicleId
  };
};