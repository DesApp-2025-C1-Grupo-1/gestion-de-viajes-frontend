import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateViajeDistribucionSchema } from "../../api/schemas/viajeDistribucion.schema";

export const useDistributionFormBase = (defaultValues?: Partial<CreateViajeDistribucionSchema>) => {
  return useForm<CreateViajeDistribucionSchema>({
    resolver: zodResolver(CreateViajeDistribucionSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      fecha_inicio: undefined,
      transportista: "",
      origen: "",
      chofer: "",
      vehiculo: "",
      tipo_viaje: "nacional", // 🔥 Este es el valor por defecto para NUEVOS viajes
      kilometros: 0,
      remito_ids: [],
      tarifa_id: undefined,
      estado: undefined,
      observaciones: "",
      ...defaultValues, // 🔥 Pero si vienen defaultValues (tripData), estos tienen prioridad
    },
  });
};