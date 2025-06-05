import { z } from "zod"
import { CreateTelefonoSchema, TelefonoSchema } from "./base/telefono.schema"
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema"

export const createChoferSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  dni: z.number().int().min(10000000).max(99999999),
  
  /*fecha_nacimiento: z
    .string()
    .refine((val) => {
      const date = dayjs(val);
      return date.isValid();
    }, { message: "Fecha inválida" })
    .refine((val) => {
      const date = dayjs(val);
      return dayjs().diff(date, "year") >= 18;
    }, { message: "Debe ser mayor de edad" }),*/

    //intento
  fecha_nacimiento: z.date().max(new Date("2005-01-01"), { message: "Too old!" }),

  licencia: z.string().min(1, "La licencia es obligatoria"),
  tipo_licencia: tipoLicenciaSchema,
  email: z.string().email(),
  empresa: z.string().regex(/^[a-f\d]{24}$/i, "ID de empresa inválido"),
  vehiculo: z.string().regex(/^[a-f\d]{24}$/i, "ID de vehículo inválido"),
  telefono: CreateTelefonoSchema,
})

export const choferSchema = createChoferSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de chofer inválido"),
})

export type CreateChoferSchema = z.infer<typeof createChoferSchema>
export type UpdateChoferSchema = z.infer<typeof choferSchema>
export type ChoferSchema = z.infer<typeof choferSchema>