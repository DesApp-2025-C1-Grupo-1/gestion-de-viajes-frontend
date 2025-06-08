import { useEffect } from "react";

export const useCrossFieldValidation = (watch: any, trigger: (name?: string) => void) => {
  const deposito_origen = watch("deposito_origen");
  const deposito_destino = watch("deposito_destino");
  const fecha_inicio = watch("fecha_inicio");
  const fecha_llegada = watch("fecha_llegada");

  useEffect(() => {
    if (deposito_origen && deposito_destino && deposito_origen !== "" && deposito_destino !== "") {
      trigger("deposito_destino");
    }
  }, [deposito_origen, deposito_destino]);

  useEffect(() => {
    if (fecha_inicio && fecha_llegada) {
      trigger("fecha_llegada");
    }
  }, [fecha_inicio, fecha_llegada]);
};
