import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { useNavigate } from "react-router-dom";
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPage";
import { Deposit } from "../../types";
import { useDeposits } from "../../hooks/deposits/useDeposits";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { formatTelefono } from "../../lib/formatters";


export default function DepositPage() {
    const {deposits, isLoading, removeDeposit} = useDeposits();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [openDialog, setOpenDialog] = useState(false);
    const [depositSelected, setDepositSelected] = useState<Deposit>();
    const debouncedQuery = useDebouncedValue(searchQuery, 500);


    const handleOpenDialog = (deposit : Deposit) => {
        setOpenDialog(true);
        setDepositSelected(deposit);
    };

    const handleDelete = async (id: string) => {
        try {
            await removeDeposit(id);
            setOpenDialog(false);
        } catch (error) {
            console.error("Error deleting deposit:", error);
        }
    };


    const filtered = deposits.filter((d) =>
        d.nombre.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        d.direccion?.ciudad.toLowerCase().includes(debouncedQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        // Si el search cambia, reseteamos a página 1
        setPage(1);
    }, [debouncedQuery]);

    const navigate = useNavigate();

    return (
        <>
            <SectionHeader 
                title="Red de Depósitos"
                description="Administre los depósitos habilitados como origen y destino en la planificación de viajes."
                buttonText="Nuevo depósito"
                onAdd={() => navigate("/depots/form")}
            />

            <SearchBar 
                placeholder="Buscar por nombre o ciudad"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />

            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",
            }}
            >
                <TableContainer className="h-full text-sm">
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Ciudad</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Horario</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow
                                    key="loading"
                                >
                                    <TableCell colSpan={7} >
                                        <LoadingState title="depósitos"/>
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length === 0 ? (
                                <TableRow
                                    key="no-deposits" 
                                >
                                    <TableCell 
                                        colSpan={7} 
                                        sx={{
                                            textAlign: "center",
                                            paddingY: "26px",
                                        }}
                                    >
                                        No se encontraron depósitos
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginated.map((deposit) => (
                                    <TableRow 
                                        key={deposit._id} 
                                        className="hover:bg-gray-50 overflow-hidden"
                                    >
                                        <TableCell sx={{fontWeight: "bold"}}>{deposit.nombre}</TableCell>
                                        <TableCell>{deposit.direccion?.ciudad}</TableCell>
                                        <TableCell>{deposit.tipo.charAt(0).toUpperCase() + deposit.tipo.slice(1)}</TableCell>
                                        <TableCell>{deposit.horario_entrada} - {deposit.horario_salida}</TableCell>
                                        <TableCell>{deposit.contacto?.nombre}</TableCell>
                                        <TableCell>{formatTelefono(deposit.contacto?.telefono)}</TableCell>
                                        <TableCell sx={{ verticalAlign: "middle"}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(deposit)}
                                            id={deposit._id}
                                            />
                                            
                                        </TableCell>
                                            
                                    </TableRow>
                                    
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            {/* Paginación */}
            <div className="flex justify-between gap-2 items-center sm:px-4 py-4 ">
                <p className="text-sm w-full">
                    Mostrando {Math.min((page - 1) * rowsPerPage + 1, filtered.length)}– 
                    {Math.min(page * rowsPerPage, filtered.length)} de {filtered.length} depósitos
                </p>
                <Pagination 
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                    color="primary"
                    sx={{width: "100%", display: "flex", justifyContent: "flex-end"}}
                />
            </div>

            {/* Dialogo de eliminar */}
            {depositSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Eliminar vehículo"
                    content={<p>
                        ¿Estás seguro que deseas eliminar el vehículo{" "}
                        <strong>{depositSelected?.nombre}</strong>?
                    </p>}
                    onConfirm={() => handleDelete(depositSelected?._id)}
                />
            )}
        </>
    )
}