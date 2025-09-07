import { useEffect } from "react";
import { UseFormSetValue, UseFormTrigger, UseFormWatch } from "react-hook-form";
import { CreateViajeSchema } from "../../api/schemas";
import { DepositoDto } from "../../api/generated";
import { AxiosResponse } from "axios";

interface UseCrossFieldValidationProps {
  watch: any;
  trigger: any;
  setValue: any;
  depots: AxiosResponse<DepositoDto[], any> | undefined;
}

export default function useCrossFieldValidation ({watch, trigger, setValue, depots} : UseCrossFieldValidationProps ){
  const deposito_origen = watch("deposito_origen");
  const deposito_destino = watch("deposito_destino");
  const fecha_inicio = watch("fecha_inicio");
  const fecha_llegada = watch("fecha_llegada");

  useEffect(() => {
    if (deposito_origen && deposito_destino && deposito_origen !== "" && deposito_destino !== "") {
      trigger("deposito_destino");
    }
    const paisOrigen = depots?.data?.find(deposito => deposito._id === deposito_origen)?.direccion?.pais.trim().toLocaleLowerCase();
    const paisDestino = depots?.data?.find(deposito => deposito._id === deposito_destino)?.direccion?.pais.trim().toLocaleLowerCase();

    if (paisOrigen !== "argentina" || paisDestino !== "argentina") {
      setValue("tipo_viaje", "internacional");
    } else {
      setValue("tipo_viaje", "nacional");
    }
  }, [deposito_origen, deposito_destino, setValue]);

  useEffect(() => {
    if (fecha_inicio && fecha_llegada) {
      trigger("fecha_llegada");
    }
  }, [fecha_inicio, fecha_llegada]);
};
