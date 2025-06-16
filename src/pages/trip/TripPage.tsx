import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SectionHeader } from "../../components/SectionHeader";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useNotify } from "../../hooks/useNotify";
import { viajeControllerRemove, ViajeDto, useViajeControllerFindAll } from '../../api/generated';
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPage";
//import de detalles
import {  Eye } from "lucide-react";


export default function TripPage() {
    const navigate = useNavigate();
    const {notify} = useNotify("Viajes");

    const {rowsPerPage} = useAutoRowsPerPage();
    const [page, setPage] = useState<number>(1);
    const { data, isLoading, refetch } = useViajeControllerFindAll({page, limit: rowsPerPage}); //paso como limit al back el rows pero ver
    //const trips = data?.items || [];

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [tripSelect, setTripSelect] = useState<ViajeDto>();

    const handleOpenDialog = (trip : ViajeDto) => {
        setOpenDialog(true);
        setTripSelect(trip);
    };

    const handleDelete = async (id: string) => {
        try {
            await viajeControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Viaje eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };


    return(
        <>
            <SectionHeader
                title="Viajes"
                description="Consulte los viajes registrados junto con su logística asociada."
                buttonText="Nuevo viaje"
                onAdd={() => navigate('/trips/form')}
            />

            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",}}>
                    <TableContainer className="h-full text-sm">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número</TableCell>
                                    <TableCell>Ruta</TableCell>
                                    <TableCell>Transportista</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell>Tipo de Viaje</TableCell>
                                    <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>

                            

                        </Table>
                    </TableContainer>

            </div>

        </>
    )
}