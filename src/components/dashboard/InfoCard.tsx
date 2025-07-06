import { Card, Typography, List, ListItem, IconButton, Divider, Box, Badge } from "@mui/material";
import { ChevronRight, Palette } from "lucide-react";
import { ReactNode } from 'react';
import { TripType } from "../../components/TripType";

//mock sacar
import { TripResumen } from "../../types";

interface InfoCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  value?: number;
  list?: TripResumen[];//any[]
  onClick?: () => void;
}

export const InfoCard = ({ title, description, icon, value, list, onClick }: InfoCardProps) => {
    return(
        <Card
            sx={{
                width: "100%",
                minHeight: 150,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: 2,
                overflow: "hidden",
                flexDirection: "column",
                justifyContent: "space-between",
                '&:hover': { boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" },
                transition: "box-shadow 0.3s ease",
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
                <Box display="flex" alignItems="center" gap={1.5}>
                    {icon}
                    <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                        {title}
                    </Typography>
                </Box>
                {onClick && (
                    <IconButton
                        onClick={onClick}
                        size="small"
                        sx={{
                            '&:hover': { color: 'primary.main', },
                        }}
                    >
                        <ChevronRight fontSize="small" />
                    </IconButton>
                )}
            </Box>
            {value !== undefined && (
                <>
                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
                    <Box  gap={1} display="flex"
                        flexDirection="column"
                        alignItems="center"
                        flexGrow={1} 
                    >
                        <Typography color="primary" variant="h6" 
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.2, 
                                transition: "transform 0.2s ease-in-out",
                                "&:hover": { transform: "scale(1.05)" } 
                            }}
                        >
                            {value}
                        </Typography>
                        {description && (
                            <Typography variant="body2" color="text.secondary">
                                {description}
                            </Typography>
                        )}
                    </Box>
                </Box>
                </>
            )}
            {list && (
                <>
                <Box padding={3} paddingTop={0}>
                    <List disablePadding>
                        {/*index temporal*/}
                        {list.map((trip, index) => (
                        <ListItem disableGutters key={trip.id} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
                            <Box>
                                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "450" }}> {`TRP ${String(index + 1).padStart(3, "0")}`} </Typography>
                                <Typography variant="caption" color="text.secondary">Inicio: {new Date(trip.fecha_inicio).toLocaleDateString()}</Typography>
                            </Box>
                            <TripType tipo={trip.tipo_viaje} />
                        </ListItem>
                        ))}
                    </List>
                    {onClick && (
                        <Box textAlign="right">
                            {/*<IconButton
                                onClick={onClick}
                                size="small"
                                sx={{
                                    '&:hover': { color: 'primary.main', },
                                }}
                            >
                            <ChevronRight fontSize="small" />
                        </IconButton>*/}
                        </Box>
                    )}
                </Box>
                </>
            )}
        </Card>
    );
}



{/*<Box>
                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                    {title}
                </Typography>
                {/*{description && (
                    <Typography variant="body2" color="text.secondary">
                    {description}
                    </Typography>
                )}
                </Box>*/}