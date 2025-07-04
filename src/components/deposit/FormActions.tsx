import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface FormActionsProps {
  loading: boolean;
  isEditing: boolean;
  isSubmitting?: boolean;
}

const FormActions = ({ loading, isEditing,isSubmitting}: FormActionsProps) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
      <Button 
        onClick={()=> navigate(-1)} 
        variant="outlined"
        disabled={loading}
      >
        Cancelar
      </Button>
      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting
              ? isEditing
                  ? "Actualizando..."
                  : "Registrando..."
              : isEditing
                  ? "Actualizar"
                  : "Registrar"
          }
      </Button>
    </Box>
  );
};

export default FormActions;