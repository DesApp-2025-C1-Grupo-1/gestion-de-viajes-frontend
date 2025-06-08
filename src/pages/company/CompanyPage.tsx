import { useEffect, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { useAutoRowsPerPage } from '../../hooks/useAutoRowsPerPage';
import SearchBar from "../../components/SearchBar";
import MenuItem from "../../components/buttons/MenuItem";
import { useNotify } from "../../hooks/useNotify";
import { empresaControllerDelete, EmpresaDto, useEmpresaControllerFindAll} from "../../api/generated";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ConfirmDialog } from "../../components/ConfirmDialog";

export default function CompanyPage(){
    const {notify} = useNotify("Empresa");
    const {data, isLoading, error, refetch} = useEmpresaControllerFindAll();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [empresaSelected, setEmpresaSelected] = useState<EmpresaDto>();
    const empresas = data?.data || [];
    const debouncedQuery = useDebouncedValue(searchQuery, 500);

    const handleOpenDialog = (company: EmpresaDto) => {
        setOpenDialog(true);
        setEmpresaSelected(company);
    };

    const handleDelete = async(id:string) => {
        try{
            await empresaControllerDelete(id);
            setOpenDialog(false);
            await refetch();
            notify("delete", "Empresa eliminada correctamente.")
            setPage(1);
        } catch(err){
            const error = err as {response:{data:{message:string}}};
            if(error.response?.data?.message){
                notify("error", error.response.data.message);
            }
        }
    };

    const filtered = empresas.filter((com) => 
    com.nombre_comercial.toLocaleLowerCase().includes(debouncedQuery.toLocaleLowerCase())
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
                title="Listado de empresas transportistas"
                description="Gestione las empresas transportistas del sistema"
                buttonText="Nueva empresa"
                onAdd={() => navigate("/company/create")}
            /> 
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar por nombre"></SearchBar>

            {/*tabla*/}
            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",
            }}>

                <TableContainer className="text-sm rounded-lg">
                    <Table aria-label="simple table">
                        <TableHead >
                            <TableRow>
                                <TableCell >Razon social</TableCell>
                                <TableCell>Nombre comercial</TableCell>
                                <TableCell>CUIT/RUT</TableCell>
                                <TableCell>Domicilio fiscal</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell align="center" sx={{width: 72}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow key="loading">
                                    <TableCell colSpan={7} >
                                        <LoadingState title="empresas"/>
                                    </TableCell>
                                </TableRow>
                            ) : paginated.length === 0 ? (
                                <TableRow key="no-companies">
                                    <TableCell 
                                        colSpan={7} 
                                        sx={{textAlign: "center", paddingY: "26px",}}
                                    >
                                        No se encontraron empresas
                                    </TableCell>
                                </TableRow>
                            ):(
                                paginated.map((company) => (
                                    <TableRow key={company._id} className="hover:bg-gray-50 overflow-hidden">
                                        <TableCell sx={{fontWeight: "bold"}}>{company.razon_social}</TableCell>
                                        <TableCell>{company.nombre_comercial}</TableCell>
                                        <TableCell>{company.cuit}</TableCell>
                                        <TableCell>{`${company.direccion?.ciudad}, ${company.direccion?.calle} ${company.direccion?.numero}`}</TableCell>
                                        <TableCell>{company.contacto?.email}</TableCell>
                                        <TableCell sx={{ verticalAlign: "middle"}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(company)}
                                            id={company._id}
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
                    Mostrando {Math.min((page-1) * rowsPerPage+1, filtered.length)} - {Math.min(page* rowsPerPage, filtered.length)} de {filtered.length} empresas
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

            {empresaSelected && (
                <ConfirmDialog 
                    open= {openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="empresa"
                    entityName={empresaSelected.nombre_comercial}
                    onConfirm={() => handleDelete(empresaSelected?._id)}
                />
            )}
        </>
    );
}