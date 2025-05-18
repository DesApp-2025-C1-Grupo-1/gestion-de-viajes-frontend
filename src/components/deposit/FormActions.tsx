import { Box, Button } from "@mui/material";

interface FormActionsProps {
  loading: boolean;
  isEditing: boolean;
  onCancel: () => void;
}

const FormActions = ({ loading, isEditing, onCancel }: FormActionsProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
      <Button 
        onClick={onCancel} 
        variant="outlined"
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        disabled={loading}
      >
        {isEditing ? "Actualizar" : "Crear"}
      </Button>
    </Box>
  );
};

export default FormActions;