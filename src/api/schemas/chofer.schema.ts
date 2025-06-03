import { z } from "zod"
import { TelefonoSchema } from "./base/telefono.schema"
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema"
import dayjs, { Dayjs } from "dayjs";

export const createChoferSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  dni: z.number().int().min(10000000).max(99999999),
  fecha_nacimiento: z
    .custom<Dayjs>((val) => dayjs.isDayjs(val), {
      message: "Debe seleccionar una fecha válida",
    })
    .refine((val) => {
      const date = val as Dayjs;
      const now = dayjs();
      const age = now.diff(date, "year");
      return age >= 18;
    }, {
      message: "El chofer debe ser mayor de edad",
  }),
  licencia: z.string().min(1, "La licencia es obligatoria"),
  tipo_licencia: tipoLicenciaSchema,
  email: z.string().email(),
  empresa: z.string().regex(/^[a-f\d]{24}$/i, "ID de empresa inválido"),
  vehiculo: z.string().regex(/^[a-f\d]{24}$/i, "ID de vehículo inválido"),
  telefono: TelefonoSchema,
})

export const choferSchema = createChoferSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de chofer inválido"),
})

export type CreateChoferSchema = z.infer<typeof createChoferSchema>
export type UpdateChoferSchema = z.infer<typeof choferSchema>
export type ChoferSchema = z.infer<typeof choferSchema>