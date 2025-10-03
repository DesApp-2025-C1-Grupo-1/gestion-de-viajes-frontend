// components/distribution-form/fields/ConditionalField.tsx

import { Box, SxProps, Theme, Tooltip, Typography } from '@mui/material';
import { Lock } from 'lucide-react';

interface ConditionalFieldProps {
  permission: boolean;
  children: React.ReactNode;
  fieldName: string;
  reason?: string;
  sx?: SxProps<Theme>;
}

export function ConditionalField({ 
  permission, 
  children, 
  fieldName, 
  reason = "No editable en el estado actual del viaje",
  sx 
}: ConditionalFieldProps) {
  
  if (!permission) {
    return (
      <Tooltip title={reason} arrow>
        <Box 
          sx={{ 
            position: 'relative',
            cursor: 'not-allowed',
            ...sx 
          }}
        >
          {/* Overlay de bloqueo */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1
            }}
          >
            <Lock size={20} color="#666" />
          </Box>
          
          {/* Campo deshabilitado */}
          <Box sx={{ pointerEvents: 'none' }}>
            {children}
          </Box>
        </Box>
      </Tooltip>
    );
  }

  return <Box sx={sx}>{children}</Box>;
}