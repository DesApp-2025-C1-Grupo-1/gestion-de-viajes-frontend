import { ChevronRight } from "lucide-react";
import { Card, Typography, Box, Divider, IconButton, Button } from "@mui/material";
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
        
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      bgcolor: "grey.100", //probar con 100
      py: 2, 
    }}
  >
    <Box
      sx={{
        bgcolor: "background.paper",
        p: 1.5,
        borderRadius: "50%",
        boxShadow: 1,
      }}
    >
      {icon} 
    </Box>
  </Box>


  
  <Box sx={{ gap: 2, p: 3}}  display="flex" 
    justifyContent="space-between" 
    alignItems="flex-start"> {/*textAlign: "center"*/}

    <Box>
        {/*color: "#047857",*/}
        <Typography sx={{ color: "grey", fontWeight: 600}}> 
            {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
        </Typography>  
    </Box>
    
    <Typography
      variant="h5"
      sx={{
        color: "primary.main",
        //color: "#047857",
        fontWeight: 700,
      }}
    >
      {value}
    </Typography>

        {/*
    <Typography variant="caption" color="text.secondary" mt={2} display="block">
      +2 este mes
    </Typography>  */}


  </Box>

        <Box sx={{ pb: 2, px:2, display: "flex", justifyContent: "flex-end"}}>
            {onClick && (
                <IconButton  //arreglar resposivee------------------------
                    onClick={onClick}
                    size="small"
                    sx={{
                        '&:hover':{color: 'primary.main'}
                    }}
                >
                    <ChevronRight />
                </IconButton>
            )}

        </Box>   
       
    </Card>
  );
};