import { Box, MenuItem, Pagination, Select, SelectChangeEvent, Typography } from "@mui/material";

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
        <Box p={2} gap={3} sx={{display: "flex", flexDirection: {xs: "column", md: "row"}, mx: "auto", width: "100%", justifyContent: {xs: "center",md: "space-between"}, alignItems: "center"}}>
            <Typography variant="body2" sx={{ width: {xs: "100%", sm: "max-content"}, whiteSpace: "nowrap",textAlign: {xs: "center", sm:"left"}}} >
                Mostrando {Math.min((page - 1) * rowsPerPage + 1, maxItemsToShow)}–{Math.min(page * rowsPerPage, maxItemsToShow)} de {maxItemsToShow} {entity}
            </Typography>

            <Box gap={3} alignItems="center" sx={{
                flexDirection: {xs: "column-reverse", sm: "row"},
                justifyContent: {xs: "center", md: "flex-end"},
                display: "flex",
                width: "100%",
            }}>
                <div className="flex items-center gap-2">
                    <span className="text-sm w-max">Filas por página: </span>
                    <Select
                        value={rowsPerPage}
                        onChange={(e) => handleChangeRowsPerPage(e)}
                        sx={{fontSize: "0.875rem", py: 0, px: 0.5, borderRadius: "4px", backgroundColor: "#F5F5F5", height: 40}}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={8}>8</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>

                </div>
            
                <Pagination 
                    count={totalPages}
                    page={page}
                    onChange={handleChangePage}
                    shape="rounded"
                    variant="outlined"
                    color="primary"
                    size="large" 
                    sx={{
                        "& .MuiPaginationItem-root": {
                            borderRadius: "4px",
                            border: "1px solid #E65F2B",
                            color: "#E65F2B",
                            fontWeight: 500,
                            transition: "all 0.2s ease",
                        },

                        "& .MuiPaginationItem-root:hover": {
                            backgroundColor: "#ff926882", 
                        },

                        "& .Mui-selected": {
                            backgroundColor: "#E65F2B !important",
                            color: "#fff !important",
                            borderColor: "#E65F2B !important",
                            "&:hover": {
                                backgroundColor: "#cf5426 !important",
                            },
                        },
                    }}

                />
            </Box>
        </Box>
    );
}