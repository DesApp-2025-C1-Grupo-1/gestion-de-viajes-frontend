import { z } from "zod"
import { CreateTelefonoSchema} from "./base/telefono.schema"
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema"
import { DateSchema, RequireSelectSchema } from "./commons"

export const createChoferSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  dni: z
    .number({
      required_error: "El dni es obligatorio",
      invalid_type_error: "El dni debe ser un número",
    }).int()
    .min(10000000, "El dni debe tener al menos 8 dígitos")
    .max(99999999, "El dni no puede tener más de 8 dígitos"),
  fecha_nacimiento: DateSchema
    .refine((date) => date.getFullYear() >= 1900, {
      message: "La fecha de nacimiento debe ser posterior a 1900",
    })
    .refine((date) => date.getFullYear() <= new Date().getFullYear(), {
      message: "La fecha de nacimiento no puede ser posterior al año actual",
    })
    .refine((date) => new Date().getFullYear() - date.getFullYear() >= 18, {
      message: "Tiene que ser mayor de 18 años",
    }),

  licencia: z.string().min(1, "La licencia es obligatoria"),
  tipo_licencia: tipoLicenciaSchema,
  email: z.string({
      required_error: "El mail es obligatorio",
      invalid_type_error: "El mail debe ser una cadena de texto",
    }).email("El mail debe ser válido"),
  empresa: RequireSelectSchema,
  vehiculo: RequireSelectSchema,
  telefono: CreateTelefonoSchema,
})

export const choferSchema = createChoferSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de chofer inválido"),
})

export type CreateChoferSchema = z.infer<typeof createChoferSchema>
export type UpdateChoferSchema = z.infer<typeof choferSchema>
export type ChoferSchema = z.infer<typeof choferSchema>
