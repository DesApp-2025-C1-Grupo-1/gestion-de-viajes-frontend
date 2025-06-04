import { Box, Button } from "@mui/material";
import { isValid } from "zod";

interface FormActionsProps {
  loading: boolean;
  isEditing: boolean;
  isValid?: boolean;
}

const FormActions = ({ loading, isEditing}: FormActionsProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
      <Button 
        onClick={()=> window.history.back()} 
        variant="outlined"
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        variant="contained" 
        color="primary"
        disabled={!isValid}
      >
        {isEditing ? "Actualizar" : "Crear"}
      </Button>
    </Box>
  );
};

export default FormActions;