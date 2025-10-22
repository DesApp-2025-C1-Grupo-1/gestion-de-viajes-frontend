import { Card, Typography, List, ListItem, IconButton, Divider, Box, Badge, Stack, Button, Chip } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { ReactNode } from 'react';
import { TripType } from "../trip/TripType";
import { RemitoDto, ViajeDistribucionDto } from "../../api/generated";
import ButtonAdd from "../buttons/ButtonAdd";
import { Link, useNavigate } from "react-router-dom";

interface InfoCardProps {
  title: string;
  description?: string;
  subDescription?: number;
  icon: ReactNode;
  value?: number;
  list?: ViajeDistribucionDto[];
  listRemitos?: RemitoDto[];
  link?: string;
  external?: boolean; // nuevo flag
}

export const InfoCard = ({
  title,
  description,
  subDescription,
  icon,
  value,
  list,
  listRemitos,
  link,
  external = false
}: InfoCardProps) => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        if (!link) return;
        if (external) window.location.href = link;
        else navigate(link);
    };

    return(
        <Card className="h-full">
            <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    {icon}
                    <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                        {title}
                    </Typography>
                </Stack>
                {link && (!list && !listRemitos ? (
                    <IconButton size="small" onClick={handleRedirect}>
                        <ChevronRight fontSize="small" />
                    </IconButton>
                ) : (
                    <Button
                        
                        variant="outlined"
                        onClick={handleRedirect}
                    >
                        Ver más
                    </Button>
                )) }
            </Box>

            {value !== undefined && <Divider />}

            {value !== undefined && (
                <Box display="flex" flexDirection="column" alignItems="center" padding={3}>
                    <Box display="flex" alignItems="center" justifyContent="center" gap={1} flexGrow={1}>
                        <Typography color="primary" variant="h6"
                            sx={{fontWeight: 700, lineHeight: 1.2, transition: "transform 0.2s ease-in-out", "&:hover": { transform: "scale(1.05)" }, }}
                        >
                            {value}
                        </Typography>
                        <Typography  color="text.primary" sx={{ color: "#5A5A65",  fontWeight: "450"}}> 
                            {description}
                        </Typography>    
                    </Box>
                    <Box pt={1}>
                         {subDescription && subDescription > 0  ? (          
                            <Typography variant="body2" color="text.secondary"> 
                                ( + {subDescription} esta semana )
                            </Typography> 
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                ( Sin datos recientes )
                            </Typography>
                        )}
                    </Box>
                </Box> 
            )}

            {/* Listado de viajes */}
            {list && (
                <Box padding={2} pt={0}>
                {list.length === 0 ? (
                    <Box py={4} textAlign="center">
                    <Typography variant="body2" color="#666">No hay viajes programados.</Typography>
                    <ButtonAdd
                        onClick={() => navigate("/trips/distribution/form")}
                        sx={{ mt: 2, width: 150, height: 40 }}
                        title="Nuevo viaje"
                    />
                    </Box>
                ) : (
                    <>
                    <List disablePadding>
                        {list.slice(0, 3).map(trip => (
                        <ListItem key={trip._id} sx={{ justifyContent: "space-between" }}>
                            <Box>
                            <Typography sx={{ color: "#5A5A65", fontWeight: 450 }}>{ trip.nro_viaje ?? (trip as any).numeroDeViaje}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Inicio: {new Date(trip.fecha_inicio).toLocaleDateString()}
                            </Typography>
                            </Box>
                            <TripType tipo={trip.tipo_viaje} />
                        </ListItem>
                        ))}
                    </List>
                    </>
                )}
                </Box>
            )}

            {/* Listado de remitos */}
            {listRemitos && (
                <Box padding={2} pt={0}>
                {listRemitos.length === 0 ? (
                    <Box py={4} textAlign="center">
                    <Typography variant="body2" color="#666">No hay remitos disponibles.</Typography>
                    <ButtonAdd
                        onClick={() => window.location.replace("https://remitos-front.netlify.app/remitos/nuevo")}
                        sx={{ mt: 2, width: 150, height: 40 }}
                        title="Nuevo remito"
                    />
                    </Box>
                ) : (
                    <>
                    <List disablePadding>
                        {listRemitos.slice(0, 3).map(remito => (
                        <ListItem key={remito.id} sx={{ justifyContent: "space-between" }}>
                            <Box>
                            <Typography sx={{ color: "#5A5A65", fontWeight: 450 }}>{remito.numeroAsignado}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Destino: {`${remito.destino?.provincia}, ${remito.destino?.localidad}`}
                            </Typography>
                            </Box>
                            <Chip
                            label={remito.estado?.nombre}
                            sx={{ backgroundColor: "#E65F2B", color: "#fff", fontWeight: 500 }}
                            />
                        </ListItem>
                        ))}
                    </List>
                </>
            )}
            </Box>
            )}
        </Card>
    );
}