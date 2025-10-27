import { Menu } from "lucide-react";
import ButtonAdd from "./buttons/ButtonAdd";
import { useOutletContext } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

interface SectionHeaderProps {
  title: string;
  buttonText?: string;
  onAdd?: () => void;
}

interface OutletContext {
  toggleSidebar: () => void;
}

export const SectionHeader = ({
  title,
  buttonText,
  onAdd
}: SectionHeaderProps) => {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const renderButton = buttonText?.trim() !== "" && onAdd;

  return (
    <Box sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: "center",
      justifyContent: "space-between",
      gap: 2,
      py: 1,
      pb: 3,
      width: "100%",
    }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start", gap: 2 , width: "100%"}}>
        {/* Botón hamburguesa solo en mobile */}

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", justifyContent: "flex-start"}}>
          <Button
            onClick={toggleSidebar}
            aria-label="Abrir menú lateral"
            sx={{
              color: "#4a5565",
              border: "1px solid #99a1af",
              backgroundColor: "#F6F7FB",
              borderRadius: "4px",
              padding: "4px",
              minWidth: "auto",
              "&:hover": { backgroundColor: "#e2e8f0" },
              transition: "background-color 0.2s ease-in-out, outline 0.2s ease-in-out",
              display: { lg: "none" },
            }}
          >
            <Menu className="size-6" />
          </Button>
          <Typography variant="h5" fontWeight={700} sx={{}}>{title}</Typography>
        </Box>
      </Box>
      {renderButton &&
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", width: "100%"}}>
          <ButtonAdd
            title={buttonText as string}
            onClick={onAdd}
            aria-label={`Añadir nuevo ${title.toLowerCase()}`}
          />
        </Box>
      }
    </Box>
  );
};