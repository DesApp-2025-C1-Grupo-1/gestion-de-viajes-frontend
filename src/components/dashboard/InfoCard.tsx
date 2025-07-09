import { Card, Typography, List, ListItem, IconButton, Divider, Box, Badge, Stack } from "@mui/material";
import { ChevronRight, Palette } from "lucide-react";
import { ReactNode } from 'react';
import { TripType } from "../../components/TripType";

//mock sacar
import { TripResumen } from "../../types";
import { DoubleCell } from "../DoubleCell";

interface InfoCardProps {
  title: string;
  description?: string;
  subDescription?: string;
  icon: ReactNode;
  value?: number;
  list?: TripResumen[];//any[]
  onClick?: () => void;
}

const cardStyles = {
  width: "100%",
  minHeight: 150,
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: 2,
  overflow: "hidden",
  flexDirection: "column",
  justifyContent: "space-between",
  '&:hover': { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
  transition: "box-shadow 0.3s ease",
};


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
                         {subDescription && (          
                            <Typography variant="body2" color="text.secondary"> 
                                {subDescription} 
                            </Typography> 
                        )}
                    </Box>
                </Box>
                
            )}
            {list && (
                <>
                <Box display="flex" flexDirection="column" gap={2} padding={3} paddingTop={0} className="items-center">
                    <List disablePadding sx={{ width: "100%"}}>
                        {/*index temporal nose ver*/}
                        {list.map((trip, index) => (
                        <ListItem disableGutters key={trip.id} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "450" }}> {`TRP ${String(index + 1).padStart(3, "0")}`} </Typography>
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


 {/*<Typography variant="body2" color="text.secondary"> 
                                {description} 
                                {subDescription} 
                            </Typography> */}


                            {/*<DoubleCell 
                                primarySection={description}
                                secondarySection={subDescription}
                            />*/}