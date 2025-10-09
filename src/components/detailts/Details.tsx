import { Grid, Paper, Typography, Tooltip, Box } from "@mui/material";
import { ReactNode } from "react";
import { Field } from "./Field";

type Field = {
  label: string;
  value: ReactNode;
  isLong?: boolean;
};

type detailsProps = {
  icon?: ReactNode;
  title: string;
  fields: Field[];
  onView?: () => void;
  onEdit?: () => void;
};

export default function CardDetails ({icon, fields, title, onView, onEdit}: detailsProps) {
    return(
        <>
        <Box display="flex" alignItems="center" gap={1} mb={1} ml={1}>
            {icon}
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
        </Box>
        <Paper
            variant="outlined"
            sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2.5,
                backgroundColor: "#F6F7FB", 
                borderColor: "#C7C7C7", 
                borderRadius: 1.5,
                boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
            }}
        >
            <article className="p-2 grid gap-4 sm:grid-cols-2 items-start">
                {fields.map((field, index) => (
                    <div key={index} className="flex flex-col gap-1 justify-between">
                        <Typography
                            variant="h6" 
                            fontWeight={600} 
                            sx={{ fontSize: '0.90rem'}}
                            className="truncate"
                        >
                            {field.label}
                        </Typography>
                        {!field.isLong ? (
                           <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                                {field.value}
                           </Box>
                        ) : (
                            <Tooltip 
                                title={field.value} 
                                placement="bottom-start"
                                slotProps={{
                                    popper: {
                                    modifiers: [
                                        {
                                        name: 'offset',
                                        options: {
                                            offset: [0, -14],
                                        },
                                    },],},
                                }}
                            >
                                <Typography variant="body2" color="text.secondary" className="truncate">
                                    {field.value}
                                </Typography>
                            </Tooltip>
                        )}
                    </div>
                ))} 
            </article>
        </Paper>
    </>
    )
}