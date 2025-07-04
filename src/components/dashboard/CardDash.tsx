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
        boxShadow: 2,
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
        <Box display="flex" alignItems="center" gap={1}>
            {icon}
            <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                    {title}
                </Typography>
                {description && (
                    <Typography variant="caption" color="text.secondary">
                    {description}
                </Typography>
                )}
            </Box>
        </Box>

        <Typography variant="h3" color="primary" fontWeight={700}>
          {value}
        </Typography>

        {onClick && (
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <IconButton
            onClick={onClick}
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
              width: 36,
              height: 36,
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Box>
      )}

        {/*
      <CardHeader   
        title={
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        }
        action={
          onClick && (
            <IconButton onClick={onClick} aria-label="Ver más"> 
              <ChevronRight className="h-6 w-6" color="#E65F2B" />
            </IconButton>
          )
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        <Box display="flex" alignItems="center" gap={1}>
            {icon}
        </Box>
        <Typography variant="h3" color="primary" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
      */}

    </Card>
  );
};