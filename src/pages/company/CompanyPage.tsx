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

import { Building2, Eye } from "lucide-react";
import EntityCard from "../../components/EntityCard";
import PaginationEntity from "../../components/PaginationEntity";

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
                <div className="bg-white rounded-lg" style={{
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
                                                        handleOpenDetails={() => navigate(`/companies/details/${company._id}`)}
                                                        id={company._id}                                                      
                                                >
                                                    <Eye className="text-gray-500 hover:text-gray-700 size-4" />
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

            <PaginationEntity
                entity="empresas"
                page={page}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                filtered={filtered}
                handleChangePage={handleChangePage}
                setRowsPerPage={setRowsPerPage}
                setPage={setPage}
            />

            {empresaSelected && (
                <ConfirmDialog 
                    open= {openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="empresa"
                    genre="la"
                    entityName={empresaSelected.nombre_comercial}
                    onConfirm={() => handleDelete(empresaSelected?._id)}
                />
            )}

        </>
    );
}