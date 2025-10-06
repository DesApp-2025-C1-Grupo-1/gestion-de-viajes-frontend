/* headerrrr   import { Box, Typography } from "@mui/material";

export const HeaderDetails = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    {icon}
    <Typography variant="subtitle1" fontWeight={600}>
      {title}
    </Typography>
  </Box>
);*/

import { Box, Typography } from "@mui/material";

export const Header2Details = ({ icon, title}: { icon: React.ReactNode; title: string}) => (
  <Box display="flex" alignItems="center" gap={1} mb={1} ml={1}>
    {icon}
    <Typography  variant="h6" fontWeight={600}>
      {title}
    </Typography>
  </Box>
);

