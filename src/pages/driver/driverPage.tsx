import { useEffect, useState } from "react";
import { Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { useAutoRowsPerPage } from '../../hooks/useAutoRowsPerPage';
import SearchBar from "../../components/SearchBar";
import MenuItem from "../../components/buttons/MenuItem";
import { useNotify } from "../../hooks/useNotify";
import { choferControllerRemove, ChoferDto, useChoferControllerFindAll } from "../../api/generated";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { DoubleCell } from "../../components/DoubleCell";
import { Phone, Mail } from "lucide-react";


import { formatTelefono } from "../../lib/formatters";


export default function DriverPage(){
    const {notify} = useNotify("Chofer");
    const {data, isLoading, refetch} = useChoferControllerFindAll();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [choferSelect, setChoferSelect] = useState<ChoferDto>();
    const choferes = data?.data || [];
    const debouncedQuery = useDebouncedValue(searchQuery, 500);

    const handleOpenDialog = (company: ChoferDto) => {
        setOpenDialog(true);
        setChoferSelect(company);
    };

    const handleDelete = async(id:string) => {
        try{
            await choferControllerRemove(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Chofer eliminado correctamente.")
            setPage(1);
        } catch(err){
            const error = err as {response:{data:{message:string}}};
            if(error.response?.data?.message){
                notify("error", error.response.data.message);
            }
        }
    };

    const filtered = choferes.filter((dri) => 
        dri.apellido.toLocaleLowerCase().includes(debouncedQuery.toLocaleLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page-1) * rowsPerPage, page*rowsPerPage);
    const handleChangePage = (event: React.ChangeEvent<unknown>, value:number) => {
        setPage(value);
    };

    useEffect(() => {
        setPage(1);
    }, [searchQuery]);

    const navigate = useNavigate();

    return(
        <>
            <SectionHeader
                title="Choferes"
                description="Gestione el personal habilitado para conducir vehículos de transporte."
                buttonText="Nuevo chofer"
                onAdd={() => navigate("/driver/create")}
            /> 
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar por apellido"></SearchBar>

            {/*tabla*/}
            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",
            }}>

                <TableContainer className="text-sm rounded-lg">
                    <Table aria-label="simple table">
                        <TableHead >
                            <TableRow>
                                <TableCell>Nombre completo</TableCell>
                                <TableCell>DNI</TableCell>
                                <TableCell>Fecha de nacimiento</TableCell>
                                <TableCell>Licencia</TableCell>
                                <TableCell>Datos de contacto</TableCell>
                                <TableCell>Empresa</TableCell>
                                <TableCell>Vehiculo asignado</TableCell>
                                <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow key="loading">
                                    <TableCell colSpan={8} >
                                        <LoadingState title="choferes"/>
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length === 0 ? (
                                <TableRow key="no-drivers">
                                    <TableCell 
                                        colSpan={8} 
                                        sx={{textAlign: "center", paddingY: "26px",}}
                                    >
                                        No se encontraron choferes
                                    </TableCell>
                                </TableRow>
                            ):(
                                paginated.map((driver) => (
                                    <TableRow key={driver._id} className="hover:bg-gray-50 overflow-hidden">
                                        <TableCell sx={{fontWeight: "bold"}}>{`${driver.nombre} ${driver.apellido}`}</TableCell>
                                        <TableCell>{driver.dni}</TableCell>
                                        <TableCell>{driver.fecha_nacimiento.split('T')[0]}</TableCell>
                                        <TableCell>{`${driver.licencia} - ${driver.tipo_licencia}`}</TableCell>
                                        <TableCell>
                                            <DoubleCell 
                                                primarySection={driver.email}
                                                secondarySection={formatTelefono(driver.telefono)}
                                                primaryIcon={<Mail  color="#AFB3B9" size={18}/>}
                                                secondaryIcon={<Phone color="#AFB3B9" size={18}/>}
                                            />
                                        </TableCell>


                                        <TableCell>{driver.empresa?.nombre_comercial}</TableCell>
                                        <TableCell>{driver.vehiculo?.modelo}</TableCell>
                                        <TableCell sx={{ verticalAlign: "middle"}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(driver)}
                                            id={driver._id}
                                            /></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <div className="flex justify-between gap-2 items-center sm:px-4 py-4 ">
                <p className="text-sm w-full">
                    Mostrando {Math.min((page-1) * rowsPerPage+1, filtered.length)} - {Math.min(page* rowsPerPage, filtered.length)} de {filtered.length} choferes
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

            {choferSelect && (
                <ConfirmDialog 
                    open= {openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="empresa"
                    entityName={choferSelect.apellido}
                    onConfirm={() => handleDelete(choferSelect?._id)}
                />
            )}
        </>
    )
}
