import { Button, InputAdornment, Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { useAutoRowsPerPage } from "../../hooks/useAutoRowsPerPega";
import SearchBar from "../../components/SearchBar";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { choferControllerRemove, ChoferDto, useChoferControllerFindAll } from "../../api/generated";

export default function DriverPage() {
    const {data, isLoading, error} = useChoferControllerFindAll()
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [openDialog, setOpenDialog] = useState(false);
    const [driverSelect, setDriverSelect] = useState<ChoferDto>();
    const driver = data?.data || [];

    const filtered = driver.filter((dri) =>
        dri.nombre.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase()) || dri.empresa.nombre_comercial.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page-1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    const handleOpenDialog = (driver: ChoferDto) => {
        setOpenDialog(true);
        setDriverSelect(driver);
    }

    const handleDelete = async(id: string) => {
        try{
            await choferControllerRemove(id);
            setOpenDialog(false);
        }
        catch(err){
            console.error("Error deleting driver", err);
        }
    };

    useEffect(() => {setPage(1)}, [searchQuery]);

    const navigate = useNavigate();

    return(
        <>
            <SectionHeader
                title="Listado de choferes"
                description="Gestione los choferes disponibles del sistema"
                buttonText="Nuevo chofer"
                onAdd={() => navigate("/driver/create")}
            />  

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar por nombre o empresa"></SearchBar>

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
                                <TableCell>Licencia</TableCell>
                                <TableCell>Tipo de licencia</TableCell>
                                <TableCell>Transportista</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading? ( 
                            <TableRow key="loading">
                                <TableCell colSpan={7}>
                                    <LoadingState title="choferes"/>
                                </TableCell>
                            </TableRow>
                            ): paginated.length === 0? (
                                <TableRow key="no-driver">
                                    <TableCell colSpan={7} sx={{textAlign: "center", paddingY: "2xpx"}}>No se encontraron choferes</TableCell>
                                </TableRow>
                            ): (
                                paginated.map((driver) => (
                                    <TableRow key={driver._id} className="hover:-bg-gray-50 overflow-hidden">
                                        <TableCell sx={{fontWeight: "bold"}}>{driver.nombre}</TableCell>
                                        <TableCell>{driver.licencia}</TableCell>
                                        <TableCell>{driver.tipo_licencia}</TableCell>
                                        <TableCell>{driver.empresa.razon_social}</TableCell>
                                        <TableCell>{driver.telefono}</TableCell>
                                        <TableCell>{driver.email}</TableCell>
                                        <TableCell sx={{verticalAlign: "middle"}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(driver)} id={driver._id}/>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="flex justify-between gap-2 items-center sm:px-4 py-4 ">
                <p className="text-sm w-full">
                    Mostrando {Math.min((page - 1) * rowsPerPage + 1, filtered.length)}– 
                    {Math.min(page * rowsPerPage, filtered.length)} de {filtered.length} choferes
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

            {driverSelect && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Eliminar Chofer"
                    content={<p>
                        ¿Estás seguro que deseas eliminar el chofer{" "}
                        <strong>{driverSelect?.nombre}</strong>?
                    </p>}
                    onConfirm={() => handleDelete(driverSelect?._id)}
                />
            )}
        </>
    );
}
