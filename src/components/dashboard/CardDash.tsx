import { ChevronRight } from "lucide-react";
import { Card, Typography, Box, IconButton, Divider } from "@mui/material";
import { ReactNode } from 'react';

interface DashboardCardProps {
    title: string;
    description?: string;
    value: number;
    icon: ReactNode
    onClick?: () => void;
}

export const DashboardCard = ({title, description, value, icon, onClick }: DashboardCardProps) => {
  return (
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
        transition: "box-shadow 0.3s ease", //nose
      }}
    >
        <Box display="flex" alignItems="center" gap={2}  padding={3}>
            {icon}
            <Box>
                <Typography variant="subtitle1"  mb={1} sx={{color: "#5A5A65", fontWeight: "bold"}}> 
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                )}
            </Box>
        </Box>
        <Divider />
        <Box display="flex" alignItems="center" justifyContent="space-between" padding={3}>
            <Box  display="flex" alignItems="baseline" gap={2}> 
                <Typography color="primary" variant="h6"
                    sx={{ fontWeight: 700 }}>
                    {value} 
                </Typography>
                {/* <Typography variant="caption" color="text.secondary" mt={2} display="block">
                    + 2 este mes
                </Typography> */}
            </Box>
            
            {onClick && (
                <IconButton
                    onClick={onClick}
                    size="small"
                    sx={{
                        '&:hover':{
                            color: 'primary.main',
                        }
                    }}
                >
                    <ChevronRight  fontSize="small"/>
                </IconButton>
            )}
        </Box>
    </Card>
  );
};