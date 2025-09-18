import { useEffect, useState } from "react";
import { getProvinciasAR, getProvinciasBR, getLocalidadesAR, getMunicipiosBR } from "../api/georefApi";

export type Provincia = {
  id: string;
  nombre: string;
}

export type Localidad = {
  id: string;
  nombre: string;
}

export const useProvincias = (pais: string) => {
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pais) return;
    setLoading(true);

    const fetch = async () => {
      try {
        if (pais === "ARG") {
          setProvincias(await getProvinciasAR());
        } else if (pais === "BRA") {
          setProvincias(await getProvinciasBR());
        } else {
          setProvincias([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [pais]);

  return { provincias, loading };
};

export const useLocalidades = (pais: string, provincia: Provincia | null) => {
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pais || !provincia) return;
    setLoading(true);

    const fetch = async () => {
      try {
        if (pais === "ARG") {
          setLocalidades(await getLocalidadesAR(provincia.nombre));
        } else if (pais === "BRA") {
          setLocalidades(await getMunicipiosBR(provincia.id));
        } else {
          setLocalidades([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [pais, provincia]);

  return { localidades, loading };
};
