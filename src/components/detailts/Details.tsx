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


export default function CardDetails({ icon, fields, title, onView, onEdit }: detailsProps) {
  return (
    <>
        <div className="flex flex-col space-y-2" >

            <Box display="flex" alignItems="center" gap={1} ml={1}>
                {icon}
                <Typography variant="h6" fontWeight={600}>
                {title}
                </Typography>
            </Box>

            <Paper
                variant="outlined" 
                sx={{
                width: "100%", 
                display: "flex",
                flexDirection: "column",
                justifyContent: "center", 
                alignItems: "center",
                p: 3,
                backgroundColor: "#F6F7FB",
                borderColor: "#C7C7C7",
                borderRadius: 2,
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.05)",
                }}
            >
                
                <div className="w-full px-15">
                    <article
                        className="w-full max-w-5xl grid gap-6 sm:grid-cols-2 items-start"
                        style={{justifyItems: "center",}}
                    >
                    {fields.map((field, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-1 justify-between w-full max-w-md"
                        >
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                sx={{ fontSize: "0.9rem",  }}
                            >
                                {field.label}
                            </Typography>

                            {!field.isLong ? (
                                <Box
                                sx={{
                                    fontSize: "0.875rem",
                                    color: "text.secondary",
                                
                                }}
                                >
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
                                        name: "offset",
                                        options: {
                                            offset: [0, -14],
                                        },
                                        },
                                    ],
                                    },
                                }}
                                >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    className="truncate"
                    
                                >
                                    {field.value}
                                </Typography>
                                </Tooltip>
                            )}
                        </div>
                    ))}
                    </article>

                </div>


            </Paper>
        </div>

    </>
  );
}


