import { Stack, Typography, Box } from '@mui/material';
import { ReactNode } from 'react';

interface DoubleCellProps {
    primarySection : string;
    secondarySection?: string;
    primaryIcon?: ReactNode;
    secondaryIcon?: ReactNode;
}

export const DoubleCell = ({
    primarySection,
    secondarySection,
    primaryIcon,
    secondaryIcon,
}: DoubleCellProps) => {
  return (
    <Stack spacing={1}>
      <Box display="flex" alignItems="center" gap={1}>
        {primaryIcon}
        <Typography variant="body2" fontWeight={450}> 
          {primarySection}
        </Typography>
      </Box>
      {secondarySection && (
        <Box display="flex" alignItems="center" gap={1}>
          {secondaryIcon}
          <Typography variant="caption">
            {secondarySection}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
