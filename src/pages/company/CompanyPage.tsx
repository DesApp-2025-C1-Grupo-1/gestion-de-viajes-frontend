import { useEffect, useState } from "react";
import { Pagination, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { SectionHeader } from "../../components/SectionHeader";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../hooks/useCompany";
import LoadingState from "../../components/LoadingState";
import { useAutoRowsPerPage } from '../../hooks/useAutoRowsPerPage';
import SearchBar from "../../components/SearchBar";
import MenuItem from "../../components/buttons/MenuItem";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { Company } from "../../types";

export default function CompanyPage(){
    const {company, isLoading, removeCompany} = useCompany();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const {rowsPerPage} = useAutoRowsPerPage();
    const [openDialog, setOpenDialog] = useState(false);
    const [companySelect, setCompanySelect] = useState<Company>();

    const filtered = company.filter((com) => 
        com.nombre_comercial.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
    );

    const totalPages = Math.ceil(filtered.length / rowsPerPage);
    const paginated = filtered.slice((page-1) * rowsPerPage, page * rowsPerPage);

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    const handleOpenDialog = (company: Company) => {
        setOpenDialog(true);
        setCompanySelect(company);
    };

    const handleDelete = async(id: string) => {
        try{
            await removeCompany(id);
            setOpenDialog(false);
        }
        catch(err){
            console.error("Error deleting company", err)
        }
    };

    useEffect(() => {setPage(1)}, [searchQuery]);

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
            <div className="bg-white rounded-lg overflow-hidden" style={{
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
                border: "0.5px solid #C7C7C7",
            }}
            >
                <TableContainer className="h-full text-sm">
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Razón social</TableCell>
                                <TableCell>Nombre comercial</TableCell>
                                <TableCell>CUIT/RUT</TableCell>
                                <TableCell>Domicilio fiscal</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center" sx={{width:72}}>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading? ( 
                            <TableRow key="loading">
                                <TableCell colSpan={7}>
                                    <LoadingState title="empresas"/>
                                </TableCell>
                            </TableRow>
                            ): paginated.length === 0? (
                                <TableRow key="no-company">
                                    <TableCell colSpan={7} sx={{textAlign: "center", paddingY: "2xpx"}}>No se encontraron empresas</TableCell>
                                </TableRow>
                            ): (
                                paginated.map((company) => (
                                    <TableRow key={company._id} className="hover:-bg-gray-50 overflow-hidden">
                                        <TableCell sx={{fontWeight: "bold"}}>{company.razon_social}</TableCell>
                                        <TableCell>{company.nombre_comercial}</TableCell>
                                        <TableCell>{company.cuit}</TableCell>
                                        <TableCell>{company.domicilio_fiscal}</TableCell>
                                        <TableCell>{company.telefono}</TableCell>
                                        <TableCell>{company.mail}</TableCell>
                                        <TableCell sx={{display:"flex", justifyContent:"center", alignItems:"center", maxHeight:72}}>
                                            <MenuItem  handleOpenDialog={() => handleOpenDialog(company)} id={company._id}/>
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
                    {Math.min(page * rowsPerPage, filtered.length)} de {filtered.length} empresas transportistas
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

            {companySelect && (
                <ConfirmDialog 
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    title="Eliminar Empresa transportista"
                    content={<p>
                        ¿Estás seguro que deseas eliminar la empresa{" "}
                        <strong>{companySelect?.nombre_comercial}</strong>?
                    </p>}
                    onConfirm={() => handleDelete(companySelect?._id)}
                />
            )}

        </>
    )

};