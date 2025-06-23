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
    <Stack spacing={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
      <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
        {primaryIcon}
        <Typography variant="body2" fontWeight={450} noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}> 
          {primarySection}
        </Typography>
      </Box>
      {secondarySection && (
        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0, overflow: 'hidden' }}>
          {secondaryIcon}
          <Typography variant="caption" noWrap sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}> 
            {secondarySection}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
