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
    <Typography variant="body2" fontFamily={mono ? "monospace" : "inherit"}>
      {value}
    </Typography>
  </Box>
);
