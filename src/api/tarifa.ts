import axios, { AxiosResponse } from "axios";
import { Tarifa } from "../services/zonaTarifas";

export const getTarifas = async () => {
  const { data } = await axios.get(
    "https://tarifas-de-costos-acme-backend.onrender.com/api/tarifas"
  );
  return data
};