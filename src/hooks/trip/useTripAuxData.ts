import { useMemo, useState } from "react";
import {
    useEmpresaControllerFindAll,
    useVehiculoControllerFindAll,
    useChoferControllerFindAll,
    useDepositoControllerFindAll,
    VehiculoDto,
    ChoferDto
} from "../../api/generated";


export default function useTripAuxData() {
    const { data: companies, error: errorCompanies, isLoading: loadingCompanies } = useEmpresaControllerFindAll();
    const { data: vehicles, error: errorVehicles, isLoading: loadingVehicles } = useVehiculoControllerFindAll();
    const { data: drivers, error: errorDrivers, isLoading: loadingDrivers } = useChoferControllerFindAll();
    const { data: depots, error: errorDepots, isLoading: loadingDepots } = useDepositoControllerFindAll();

    const [filteredVehiculos, setFilteredVehiculos] = useState<VehiculoDto[]>([]);
    const [filteredChoferes, setFilteredChoferes] = useState<ChoferDto[]>([]);

    const filterByCompany = (companyId?: string) => {
        if (!companyId) {
        setFilteredVehiculos(vehicles?.data || []);
        setFilteredChoferes(drivers?.data || []);
        return;
        }
        setFilteredVehiculos(vehicles?.data.filter(v => v.empresa._id === companyId) || []);
        setFilteredChoferes(drivers?.data.filter(d => d.empresa._id === companyId) || []);
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