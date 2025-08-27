import { useEffect, useState } from "react";
import { MenuItem, Pagination, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material";
import MenuItemDialog from "../../components/buttons/MenuItem";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import SearchBar from "../../components/SearchBar";
import { useNotify } from "../../hooks/useNotify";
import { empresaControllerDelete, EmpresaDto, useEmpresaControllerFindAll} from "../../api/generated";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ConfirmDialog } from "../../components/ConfirmDialog";

import { Building2 } from "lucide-react";
import EntityCard from "../../components/EntityCard";

export default function CompanyPage(){
    const {notify} = useNotify("Empresa");
    const {data, isLoading, refetch} = useEmpresaControllerFindAll();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(false);
    const [empresaSelected, setEmpresaSelected] = useState<EmpresaDto>();
    const empresas = data?.data || [];
    const debouncedQuery = useDebouncedValue(searchQuery, 500);

    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg")); 

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

    //change card
    const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
        setTimeout(() => {
            setRowsPerPage(parseInt(event.target.value as string, 10))
            setPage(1)
        }, 300);
    }

    const navigate = useNavigate();

    return(
        <>
            <div> 
                <SectionHeader
                    title="Empresas transportistas"
                    description="Gestione las empresas habilitadas para operar en el sistema logístico."
                    buttonText="Nueva empresa"
                    onAdd={() => navigate("/company/create")}
                /> 
                <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Buscar por nombre"></SearchBar>
            </div>
            {/*tabla*/}

            {isMobile ? (
                <div className="grid gap-4  lg:grid-cols-2">
                    {paginated.map(company => (
                        <EntityCard
                            key={company._id}
                            title={company.nombre_comercial}
                            subtitle={`${company.razon_social}`}
                            icon={<Building2 size={24}/>}
                            fields={[
                                { label: "CUIT/RUT", value: company.cuit },
                                { label: "Contacto", value: company.contacto.email, isLong: true},
                                { label: 'Domicilio fiscal', value: [company.direccion?.ciudad, ' - ', company.direccion?.calle, ' ', company.direccion?.numero,], isLong: true },
                            ]}
                            onDelete={() => handleOpenDialog(company)}
                            onEdit={() => navigate(`/companies/edit/${company._id}`)}            
                        />
                    ))}
                </div>
            ):(           
                <div className="bg-white rounded-lg overflow-hidden" style={{
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                    border: "0.5px solid #C7C7C7",
                }}>

                    <TableContainer className=" text-sm rounded-lg">
                        <Table aria-label="simple table">
                            <TableHead >
                                
                                <TableRow>
                                    <TableCell>Razón social</TableCell>
                                    <TableCell>Nombre comercial</TableCell>
                                    <TableCell>CUIT/RUT</TableCell>
                                    <TableCell sx={{minWidth: 200}}>Domicilio fiscal</TableCell>
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
                                            colSpan={6} 
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
                                                <MenuItemDialog  
                                                        handleOpenDialog={() => handleOpenDialog(company)}
                                                        id={company._id}
                                                >
                                                </MenuItemDialog>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}

            <div className="flex justify-between items-center  container mx-auto py-4 "> 
                <p className="text-sm w-full">
                    Mostrando {Math.min((page-1) * rowsPerPage+1, filtered.length)} - {Math.min(page* rowsPerPage, filtered.length)} de {filtered.length} empresas
                </p>
                

                <div className="flex items-center w-full justify-between">
                    <div className="flex items-center w-full gap-2">
                        <span className="text-sm w-max">Filas por página: </span>
                        <Select
                            value={rowsPerPage}
                            onChange={(e) => handleChangeRowsPerPage(e)}
                            sx={{fontSize: "0.875rem", py: 0, px: 1, borderRadius: "4px", backgroundColor: "#F5F5F5"}}
                        >
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                        </Select>
                    </div>
                
                    <Pagination 
                        count={totalPages}
                        page={page}
                        onChange={handleChangePage}
                        shape="rounded"
                        color="primary"
                        sx={{width: "100%", display: "flex", justifyContent: "flex-end"}}
                    />
                </div>

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