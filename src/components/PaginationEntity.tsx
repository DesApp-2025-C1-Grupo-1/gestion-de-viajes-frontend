import { MenuItem, Pagination, Select, SelectChangeEvent } from "@mui/material";

interface PaginationEntityProps {
    entity: string;
    page: number;
    totalPages: number;
    rowsPerPage: number;
    filtered: any[];
    handleChangePage: (event: React.ChangeEvent<unknown>, value: number) => void;
    setRowsPerPage: (rows: number) => void;
    setPage: (page: number) => void;
    totalItems?: number;
}

export default function PaginationEntity({ entity, page,totalPages, rowsPerPage, filtered, handleChangePage, setRowsPerPage, setPage, totalItems }: PaginationEntityProps) {

    const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
        setTimeout(() => {
            setRowsPerPage(parseInt(event.target.value as string, 10));
            setPage(1);
        }, 300);
    };

    const maxItemsToShow = totalItems ? totalItems : filtered.length;
    
    return (
        <div className="flex flex-col gap-4 justify-between items-center  container mx-auto py-4 ">
            <p className="text-sm w-full">
                Mostrando {Math.min((page - 1) * rowsPerPage + 1, maxItemsToShow)}–{Math.min(page * rowsPerPage, maxItemsToShow)} de {maxItemsToShow} {entity}
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
    );
}