import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, Typography, Box, Button, Divider, IconButton } from "@mui/material";
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
        boxShadow: 1, 
        borderRadius: 2, 
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        '&:hover': {boxShadow: 2 },
        transition: 'box-shadow 0.2s ease', //nose
      }}
    >
        <Box display="flex" alignItems="center" gap={2}  padding={3}>
            {icon}
            <Box>
                <Typography variant="subtitle1"  mb={1}  fontWeight={600} > 
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
            <Typography color="primary">
                {value}
            </Typography>
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