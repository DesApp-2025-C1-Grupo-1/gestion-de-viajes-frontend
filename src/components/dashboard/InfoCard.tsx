import { Card, Typography, List, ListItem, IconButton, Divider, Box, Badge, Stack, Button } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { ReactNode } from 'react';
import { TripType } from "../trip/TripType";
import { ViajeDto } from "../../api/generated";
import ButtonAdd from "../buttons/ButtonAdd";

interface InfoCardProps {
  title: string;
  description?: string;
  subDescription?: number;
  icon: ReactNode;
  value?: number;
  list?: ViajeDto[];
  onClick?: () => void;
}

export const InfoCard = ({ title, description, icon, value, list, onClick, subDescription }: InfoCardProps) => {
    return(
        <Card className="h-full">
            <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
                <Stack direction="row" alignItems="center" gap={1.5}>
                    {icon}
                    <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                        {title}
                    </Typography>
                </Stack>
                {value !== undefined && onClick && (
                <IconButton onClick={onClick} size="small" sx={{ '&:hover': { color: 'primary.main' } }} >
                    <ChevronRight fontSize="small" />
                </IconButton>
                )}
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
            {list && (
                <>
                <Box display="flex" flexDirection="column" gap={2} padding={3} paddingTop={0} className="items-center" height={"100%"} justifyContent={"space-between"}>

                    {list.length === 0 ? ( 
                        <Box py={4} gap={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" , height: "100%" }}>
                            <Typography variant="body2" color="#666">No hay viajes programados.</Typography>
                            <ButtonAdd
                                onClick={onClick}
                                sx={{ width: "100%", maxWidth: 150, height: 40, fontSize: "0.875rem", fontWeight: 500 }}
                                title="Nuevo viaje"
                            />
                        </Box>
                    ) : (
                        <List disablePadding sx={{ width: "100%", height: "100%"}}>
                            {list.map((trip) => (
                                <ListItem disableGutters key={trip._id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "450" }}> {trip._id} </Typography>
                                        <Typography variant="caption" color="text.secondary">Inicio: {new Date(trip.fecha_inicio).toLocaleDateString()}</Typography>
                                    </Box>
                                    <TripType tipo={trip.tipo_viaje} />
                                </ListItem>
                            ))}
                        </List>
                            
                    )}
                    

                    {list.length !== 0 && onClick && (
                        <Box textAlign="right" marginRight={2} width="100%">
                        <Button variant="outlined" sx={{ color: 'primary.main', fontWeight: 500, borderRadius: 1, ":hover": { backgroundColor: "#fff7ee"}}} onClick={onClick}>
                                Ver más
                            </Button>
                        </Box>
                    )}
                </Box>
                </>
            )}
        </Card>
    );
}