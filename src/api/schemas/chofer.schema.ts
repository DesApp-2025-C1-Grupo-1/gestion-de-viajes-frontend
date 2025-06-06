import { z } from "zod"
import { CreateTelefonoSchema} from "./base/telefono.schema"
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema"
import { RequireSelectSchema } from "./commons"

export const createChoferSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  apellido: z.string().min(1, "El apellido es obligatorio"),
  dni: z.number().int().min(10000000).max(99999999),
  fecha_nacimiento: z.date({
    required_error: "La fecha de nacimiento es obligatoria",
  }),
  licencia: z.string().min(1, "La licencia es obligatoria"),
  tipo_licencia: tipoLicenciaSchema,
  email: z.string().email(),
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