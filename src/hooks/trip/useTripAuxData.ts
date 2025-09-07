import { useEffect,  useState } from "react";
import {
    useEmpresaControllerFindAll,
    useVehiculoControllerFindAll,
    useChoferControllerFindAll,
    useDepositoControllerFindAll,
    VehiculoDto,
    ChoferDto
} from "../../api/generated";
import { useWatch } from "react-hook-form";

interface UseTripAuxDataProps {
    control: any; // Assuming control is passed from a form library like react-hook-form
    resetField: any; // Function to reset form fields
}

export default function useTripAuxData({control, resetField}: UseTripAuxDataProps) {
    const { data: companies, error: errorCompanies, isLoading: loadingCompanies } = useEmpresaControllerFindAll();
    const { data: vehicles, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();
    const { data: drivers, error: errorDrivers, isLoading: loadingDrivers } = useChoferControllerFindAll();
    const { data: depots, error: errorDepots, isLoading: loadingDepots } = useDepositoControllerFindAll();

    const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoDto[]>([]);
    const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>([]);

    const companyIdTrip = useWatch({ control, name: "empresa" });
    const currentDriverId = useWatch({ control, name: "chofer" });
    const currentVehicleId = useWatch({ control, name: "vehiculo" });

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

        if (currentVehicleId && !filteredVehicles.some(v => v._id === currentVehicleId)) {
            resetField("vehiculo");
        }
        if (currentDriverId && !filteredDrivers.some(d => d._id === currentDriverId)) {
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