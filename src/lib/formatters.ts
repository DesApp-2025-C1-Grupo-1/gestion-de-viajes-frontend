export const formatTelefono = (telefono?: {
  codigo_pais?: string;
  codigo_area?: string;
  numero?: string;
}) => {
  if (!telefono?.codigo_pais || !telefono?.numero) return "";

  const { codigo_pais, codigo_area, numero } = telefono;

  if (codigo_pais === "54" && codigo_area) {
    return `+ ${codigo_pais} ${codigo_area} ${numero}`;
  }

  return `+ ${codigo_pais} ${numero}`;
};

/*
export const formatTelefono = (
  telefono?: {
    codigo_pais?: string;
    codigo_area?: string;
    numero?: string;
  } | string 
) => {
  if (typeof telefono === 'string') return telefono;

  if (!telefono?.codigo_pais || !telefono?.numero) return "";

  const { codigo_pais, codigo_area, numero } = telefono;

  if (codigo_pais === "54" && codigo_area) {
    return `+${codigo_pais} ${codigo_area} ${numero}`;
  }

  return `+${codigo_pais} ${numero}`;
};*/