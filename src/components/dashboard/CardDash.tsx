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
        p: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        '&:hover': {boxShadow: 2 },
        transition: 'box-shadow 0.2s ease', //nose
      }}
    >
        <Box display="flex" alignItems="center" gap={2} mb={4}>
            {icon}
            <Box>
                <Typography variant="subtitle1"  mb={1}  fontWeight={600} sx={{color: 'primary.secondary'}}> 
                    {title}
                </Typography>
                {description && (
                    <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
                )}
            </Box>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between">
            
        <Typography variant="h3" color="primary" fontWeight={700}>
            {value}
        </Typography>

        {onClick && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
            <IconButton
                onClick={onClick}
                size="small"
                sx={{
                    width: 32,
                    height: 32,
                    '&:hover':{
                        color: 'primary.main',
                    }
                }}
            >
                <ChevronRight fontSize="small" />
            </IconButton>
            </Box>
        )}

        </Box>
        

        
    </Card>
  );
};