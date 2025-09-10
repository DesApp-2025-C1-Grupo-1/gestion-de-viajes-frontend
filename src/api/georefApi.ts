import axios from "axios";

// ---------- Argentina ----------
export const getProvinciasAR = async () => {
  const { data } = await axios.get(
    "https://apis.datos.gob.ar/georef/api/provincias"
  );
  return data.provincias.map((p: any) => ({
    id: p.id,
    nombre: p.nombre,
  }));
};

export const getLocalidadesAR = async (provincia: string) => {
  const { data } = await axios.get(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=5000`
  );
  return data.localidades.map((l: any) => ({
    id: l.id,
    nombre: l.nombre,
  }));
};

// ---------- Brasil ----------
export const getProvinciasBR = async () => {
  const { data } = await axios.get(
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
  );
  return data.map((estado: any) => ({
    id: estado.id,
    nombre: estado.nome,
  }));
};

export const getMunicipiosBR = async (uf: string) => {
  const { data } = await axios.get(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );
  return data.map((m: any) => ({
    id: m.id,
    nombre: m.nome,
  }));
};