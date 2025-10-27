import { Chip } from "@mui/material";

const getLicenseSx = (licenseType: string) => {
  const styles: Record<string, any> = {
    B1: { backgroundColor: "#dc2626", color: "#fecaca" }, // rojo oscuro / rojo claro
    B2: { backgroundColor: "#dc2626", color: "#fecaca" },
    C1: { backgroundColor: "#2563eb", color: "#dbeafe" }, // azul vibrante / azul claro
    C2: { backgroundColor: "#7c3aed", color: "#ede9fe" }, // púrpura vibrante / violeta claro
    C3: { backgroundColor: "#047857", color: "#a7f3d0" }, // verde esmeralda oscuro / verde claro
    D1: { backgroundColor: "#d97706", color: "#fef3c7" }, // ámbar oscuro / amarillo claro
    D2: { backgroundColor: "#d97706", color: "#fef3c7" },
    D3: { backgroundColor: "#d97706", color: "#fef3c7" },
    E1: { backgroundColor: "#ea580c", color: "#ffedd5" }, // naranja oscuro / naranja claro
    E2: { backgroundColor: "#ea580c", color: "#ffedd5" },
  };

  return {
    fontWeight: 500,
    width: '48px',
    border: 'none',
    ...styles[licenseType] || {
      backgroundColor: "#4b5563",
      color: "#f3f4f6",
      borderColor: "#6b7280",
    },
  };
};

export default function LicenseValidate({ licenseType }: { licenseType: string }) {
    return (
        <Chip 
            label={licenseType} 
            size="small"
            variant="outlined"
            sx={getLicenseSx(licenseType || '')}
            data-testid="license-chip"
        />
    );
}