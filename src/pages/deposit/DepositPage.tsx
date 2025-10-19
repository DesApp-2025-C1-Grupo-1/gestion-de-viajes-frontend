import { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import { SectionHeader } from "../../components/SectionHeader";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery} from "@mui/material";
import LoadingState from "../../components/LoadingState";
import MenuItem from "../../components/buttons/MenuItem";
import { useNavigate } from "react-router-dom";
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPage";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { formatTelefono } from "../../lib/formatters";
import { useNotify } from "../../hooks/useNotify";
import { depositoControllerRemove, DepositoDto, useDepositoControllerFindAll } from "../../api/generated";
import { Eye, Warehouse } from "lucide-react";
import { DetailsDeposit } from "../../components/deposit/DetailsDeposit";
import { useTheme } from "@mui/material/styles";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";


export default function DepositPage() {
    const {notify} = useNotify("Depósitos");
    const {data: deposits, isLoading, refetch} = useDepositoControllerFindAll();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
    const [depositSelected, setDepositSelected] = useState<DepositoDto>();
    const debouncedQuery = useDebouncedValue(searchQuery, 500);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg")); // <1280px

    const handleOpenDialog = (deposit : DepositoDto) => {
        setOpenDialog(true);
        setDepositSelected(deposit);
    };

    const handleOpenDetails = (deposit: DepositoDto) => {
        setOpenDetailsDialog(true);
        setDepositSelected(deposit);
    };

    const handleDelete = async (id: string) => {
        try {
            await depositoControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Depósito eliminado correctamente");
            setPage(1);
        } catch (e) {
            const error = e as { response: { data: { message: string } } };
            if (error.response?.data?.message) {
                notify("error", error.response.data.message);
            }
        }
    };


    const filtered = deposits?.data?.filter((d) =>
        d.nombre.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        d.direccion?.ciudad.toLowerCase().includes(debouncedQuery.toLowerCase())
    ) || [];

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
            <div>
                <SectionHeader 
                    title="Red de depósitos"
                    description="Administre la red de depósitos del sistema logístico."
                    buttonText="Nuevo depósito"
                    onAdd={() => navigate("/depots/form")}
                />

                <SearchBar 
                    placeholder="Buscar por nombre o ciudad"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                />
            </div>

            {/*tabla*/}
            {isMobile ? (
                <div className="grid gap-4  lg:grid-cols-2">
                    {paginated.map(deposit => (
                        <EntityCard
                            key={deposit._id}
                            title={`${deposit.nombre}`}
                            subtitle={`${deposit.direccion?.calle} ${deposit.direccion?.numero}, ${deposit.direccion?.ciudad}`}
                            icon={<Warehouse size={24}/>}
                            fields={[
                                { label: "Ciudad", value:   deposit.direccion?.ciudad },
                                { label: "Tipo", value:     deposit.tipo.charAt(0).toUpperCase() + deposit.tipo.slice(1) },
                                { label: "Horario", value:  deposit.horario_entrada + " - " + deposit.horario_salida },
                                { label: "Teléfono", value: formatTelefono(deposit.contacto.telefono) },
                                { label: "Email", value: deposit.contacto.email, isLong: true, isMail: true},
                            ]}
                            onDelete={() => handleOpenDialog(deposit)}
                            onEdit={() => navigate(`/depots/edit/${deposit._id}`)}
                            onView={() => navigate(`/depots/details/${deposit._id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg" style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}
                >
                    <TableContainer className="h-full text-sm rounded-lg">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Ciudad</TableCell>
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
                                            <TableCell>{deposit.horario_entrada} - {deposit.horario_salida}</TableCell>
                                            <TableCell>{deposit.contacto?.nombre}</TableCell>
                                            <TableCell>{formatTelefono(deposit.contacto?.telefono)}</TableCell>
                                            <TableCell sx={{ verticalAlign: "middle"}}>
                                                <MenuItem  handleOpenDialog={() => handleOpenDialog(deposit)}
                                                handleOpenDetails={() => navigate(`/depots/details/${deposit._id}`)}
                                                id={deposit._id}
                                                >
                                                    <Eye className="text-gray-500 hover:text-gray-700 size-4" />
                                                </MenuItem>
                                                
                                            </TableCell>
                                                
                                        </TableRow>
                                        
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            {/* Paginación */}
            <PaginationEntity
                entity="depósitos"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filtered}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {/* Dialogo de eliminar */}
            {depositSelected && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Depósito"
                    genre="el"
                    aria-labelledby="confirm-delete-title"
                    aria-describedby="confirm-delete-description"
                    entityName={depositSelected.nombre}
                    onConfirm={() => handleDelete(depositSelected?._id)}
                />
            )}

            {/*{depositSelected && (
                <DetailsDeposit 
                    depositSelected={depositSelected}
                    setOpenDetailsDialog={setOpenDetailsDialog}
                    openDetailsDialog={openDetailsDialog}
                />
            )}*/}

        </>
    )
}