import { useEffect, useMemo, useState } from "react";
import {
    useEmpresaControllerFindAll,
    useVehiculoControllerFindAll,
    useChoferControllerFindAll,
    useDepositoControllerFindAll,
    VehiculoDto,
    ChoferDto
} from "../../api/generated";

interface UseTripAuxDataProps {
    control: any; // Assuming control is passed from a form library like react-hook-form
    resetField: (fieldName: "vehiculo" | "chofer" | "fecha_inicio" | "fecha_llegada" | "tipo_viaje" | "deposito_origen" | "deposito_destino" | "empresa") => void; // Function to reset form fields; // Function to reset form fields

}

export default function useTripAuxData({control, resetField}: UseTripAuxDataProps) {
    const { data: companies, error: errorCompanies, isLoading: loadingCompanies } = useEmpresaControllerFindAll();
    const { data: vehicles, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();
    const { data: drivers, error: errorDrivers, isLoading: loadingDrivers } = useChoferControllerFindAll();
    const { data: depots, error: errorDepots, isLoading: loadingDepots } = useDepositoControllerFindAll();

    const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoDto[]>([]);
    const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>([]);

    const companyIdTrip = useMemo(() => {
        // Obtener el ID de la empresa del viaje actual desde el formulario
        return control._formValues.empresa;
    }, [control._formValues.empresa]);

    // Filtrar vehículos y choferes por la empresa del viaje actual
    useEffect(() => {
        if (companyIdTrip) {
            filterByCompany(companyIdTrip);
        } else {
            // Si no hay empresa seleccionada, mostrar todos los vehículos y choferes
            setFilteredVehiculos(vehicles?.data || []);
            setFilteredChoferes(drivers?.data || []);
        }
    }, [companyIdTrip, vehicles, drivers]);

    const filterByCompany = (companyId?: string) => {
        if (!companyId) {
            setFilteredVehiculos(vehicles?.data || []);
            setFilteredChoferes(drivers?.data || []);
            return;
        }
        const filteredVehicles = vehicles?.data.filter(v => v.empresa._id === companyId) || [];
        const filteredDrivers = drivers?.data.filter(d => d.empresa._id === companyId) || [];
        setFilteredVehiculos(filteredVehicles);
        setFilteredChoferes(filteredDrivers);

        // Si el vehículo actual no está en la lista filtrada, limpiar el campoAdd commentMore actions
        const currentVehicleId = control._formValues.vehiculo;
        if (currentVehicleId && !filteredVehicles.some(vehicle => vehicle._id === currentVehicleId)) {
            resetField("vehiculo");
        }
        // Si el chofer actual no está en la lista filtrada, limpiar el campo
        const currentDriverId = control._formValues.chofer;
        if (currentDriverId && !filteredDrivers.some(driver => driver._id === currentDriverId)) {
            resetField("chofer");
        }
    };

    return {
        companies,
        vehicles,
        drivers,
        depots,
        errorCompanies,
        errorVehicles,
        errorDrivers,
        errorDepots,
        filteredVehiculos,
        filteredChoferes,
        filterByCompany,
        loadingAuxData: loadingCompanies || loadingVehicles || loadingDrivers || loadingDepots,
    };
}