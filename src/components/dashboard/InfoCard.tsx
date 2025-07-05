import {
  Card, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Divider,
  Box
} from "@mui/material";

import { ChevronRight, MapPinned } from "lucide-react";
import { ReactNode } from 'react';

//mock sacar
import { TripType } from "../../components/TripType";
import { TripResumen } from "../../types";

interface InfoCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  value?: number;
  list?: TripResumen[];
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

            <Box display="flex" alignItems="center" gap={2} padding={3}>
                {icon}
                <Box>
                <Typography variant="subtitle1" sx={{ color: "#5A5A65", fontWeight: "bold" }}>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text.secondary">
                    {description}
                    </Typography>
                )}
                </Box>
            </Box>

            {value !== undefined && (
                <>
                <Divider />
                <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
                    <Typography color="primary" variant="h6" sx={{ fontWeight: 700 }}>
                    {value}
                    </Typography>
                    {onClick && (
                    <IconButton
                        onClick={onClick}
                        size="small"
                        sx={{
                        '&:hover': {
                            color: 'primary.main',
                        },
                        }}
                    >
                        <ChevronRight fontSize="small" />
                    </IconButton>
                    )}
                </Box>
                </>
            )}


            {list && (
                <>
                <List>
                    {list.map((trip) => (
                    <ListItem key={trip.id}>
                        <ListItemText
                        primary={`#${trip.id.slice(0, 8)}...`}
                        secondary={`Inicio: ${new Date(trip.fecha_inicio).toLocaleDateString()}`}
                        />
                        <TripType tipo={trip.tipo_viaje} />
                    </ListItem>
                    ))}
                </List>
                {onClick && (
                    <Box textAlign="right">
                    <IconButton
                        onClick={onClick}
                        size="small"
                        sx={{
                        '&:hover': {
                            color: 'primary.main',
                        },
                        }}
                    >
                        <ChevronRight fontSize="small" />
                    </IconButton>
                    </Box>
                )}
                </>
            )}


        </Card>
    );
}