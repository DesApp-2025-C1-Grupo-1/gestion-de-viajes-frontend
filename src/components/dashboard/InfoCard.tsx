import { Card, Typography, List, ListItem, IconButton, Divider, Box, Badge, Stack } from "@mui/material";
import { ChevronRight } from "lucide-react";
import { ReactNode } from 'react';
import { TripType } from "../../components/TripType";
import { ViajeDto } from "../../api/generated";

interface InfoCardProps {
  title: string;
  description?: string;
  subDescription?: number;
  icon: ReactNode;
  value?: number;
  list?: ViajeDto[];//any[]
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
                <Box display="flex" flexDirection="column" gap={2} padding={3} paddingTop={0} className="items-center">
                    <List disablePadding sx={{ width: "100%"}}>
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
                    {onClick && (
                        <Box textAlign="right" marginRight={2} width="100%">
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500, cursor: 'pointer' }} onClick={onClick}>
                                Ver más
                            </Typography>
                        </Box>
                    )}
                </Box>
                </>
            )}
        </Card>
    );
}