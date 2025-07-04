import { Box, Typography } from "@mui/material";
import { Fragment } from "react/jsx-runtime";

type InfoSectionProps = {
  title: string;
  fields: { label: string; value: string }[];
};

const InfoSection = ({ title, fields }: InfoSectionProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
    <Typography sx={{fontWeight:600, color:"#4D6280" , fontSize: '0.875rem'}}>{title}</Typography>
    {fields.map((f, i) => (
      <Fragment key={i}>
        <Typography sx={{fontWeight:500, color:"#4D6280", fontSize: '0.875rem'}}>{f.label}</Typography>
        <Typography sx={{fontWeight:600, color:"#5A5A65", fontSize: '0.875rem'}}>{f.value}</Typography>
      </Fragment>
    ))}
  </Box>
);

export default InfoSection;
