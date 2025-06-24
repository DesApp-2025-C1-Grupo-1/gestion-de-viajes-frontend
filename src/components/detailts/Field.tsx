import { Box, Typography } from "@mui/material";

export const Field = ({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box
      sx={{fontFamily: mono ? "monospace" : "inherit", fontSize: "1rem",  color: "text.primary"}}>
      {value}
    </Box>
  </Box>
);
