import { Grid, Paper, Typography, Tooltip, Box, useMediaQuery } from "@mui/material";
import { ReactNode } from "react";
import { RemitoDto } from "../../api/generated";
import { PrioridadType } from './PrioridadType';
import { useTheme } from "@mui/material/styles";

type detailsRemitosProps = {
  icon?: ReactNode;
  title: string;
  remitos: RemitoDto[];
};

export default function CardRemitosDetails({ icon, remitos, title,} : detailsRemitosProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
        <div className="flex flex-col space-y-2 " >       
            <Box display="flex" alignItems="center" gap={1} ml={1}>
                {icon}
                <Typography variant="h6" fontWeight={600}>
                {title}
                </Typography>
            </Box>

            <Paper
                variant="outlined" 
                sx={{
                width: "100%", 
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", 
                alignItems: "center",
                p: 3,
                backgroundColor: "#F6F7FB",
                borderColor: "#C7C7C7",
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                }}
            >
             
                <div className="w-full flex flex-col gap-2 px-8">

                    {/* mobile remitos */}
                    {isMobile ? (
                        <div className="flex flex-col gap-3">
                        {remitos.map((rem) => (
                            <div key={rem.id} className="flex flex-col gap-2 text-sm pb-10">
                                <div className="flex gap-x-3 justify-between items-center truncate border-b border-gray-300 pb-2" >
                                    <div className="flex items-center gap-x-2 text-sm font-bold">
                                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>N°</Typography>
                                        {rem.numeroAsignado}
                                    </div>
                                    <div className="flex items-center">
                                        <PrioridadType prioridad={rem.prioridad} />
                                    </div>
                      
                                </div>
                                <div className="flex gap-x-2 justify-height items-center truncate" >
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Estado:</Typography>
                                    <Tooltip
                                        title={rem.estado?.nombre}
                                        placement="bottom-start"
                                        slotProps={{
                                        popper: {
                                            modifiers: [
                                            {
                                                name: "offset",
                                                options: {
                                                offset: [0, -14],
                                                },
                                            },
                                            ],
                                        },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "block",
                                                width: "100%",
                                                maxWidth: "100%",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {rem.estado?.nombre}

                                         </Typography>
                                    </Tooltip>
                                </div>

                                <div className="flex gap-x-2 justify-height items-center truncate" >
                                    <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Destino:</Typography>
                                    <Tooltip
                                        title={rem.destino?.nombre}
                                        placement="bottom-start"
                                        slotProps={{
                                        popper: {
                                            modifiers: [
                                            {
                                                name: "offset",
                                                options: {
                                                offset: [0, -14],
                                                },
                                            },
                                            ],
                                        },
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "block",
                                                width: "100%",
                                                maxWidth: "100%",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {rem.destino?.nombre}

                                         </Typography>
                                    </Tooltip>
                                </div>
                            </div>
                       
                        ))}
                        </div>
                    ) : (
                        <>
                        <div className="grid grid-cols-4 gap-4 text-xs font-semibold border-b border-gray-300 pb-2">
                            <div className="flex justify-center items-center truncate">
                            <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Número</Typography>
                            </div>
                            <div className="flex justify-center items-center truncate">
                            <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Estado</Typography>
                            </div>
                            <div className="flex justify-center items-center truncate">
                            <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Destino</Typography>
                            </div>
                            <div className="flex justify-center items-center truncate">
                            <Typography variant="h6" fontWeight={600} sx={{ fontSize: "0.9rem" }}>Prioridad</Typography>
                            </div>
                        </div>

                        {remitos.map((rem) => (
                            <div key={rem.id} className="grid grid-cols-4 gap-4 text-sm py-2">
                            <div className="flex justify-center items-center truncate">{rem.numeroAsignado}</div>
                            <div className="flex justify-center items-center truncate">{rem.estado?.nombre}</div>
                            <div className="flex justify-center items-center truncate">{rem.destino?.nombre}</div>
                            <div className="flex justify-center items-center truncate"><PrioridadType prioridad={rem.prioridad} /></div>
                            </div>
                        ))}
                        </>
                    )}
                </div>


            </Paper>
        </div>

    </>
  );
}


