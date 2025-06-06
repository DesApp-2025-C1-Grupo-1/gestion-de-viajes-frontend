import { z } from "zod"
import { ObjectIdSchema, RequireSelectSchema } from "./commons"

const patenteRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/

export const CreateVehiculoSchema = z.object({
  patente: z.string().min(1, "La patente es requerida").regex(patenteRegex, "Formato de patente inválido (Ej: ABC123 o AB123CD)"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  año: z.number().int().min(1900, "El año tiene que ser mayor a 1900").max(2025, "El año no puede ser mayor al actual"),
  volumen_carga: z
    .number({ required_error: "El volumen es obligatorio" })
    .positive({ message: "El volumen debe ser un número positivo" }),
  peso_carga: z
    .number({ required_error: "El peso es obligatorio" })
    .positive({ message: "El peso debe ser un número positivo" }),
  tipo: RequireSelectSchema,
  empresa: RequireSelectSchema,
})

export const VehiculoSchema = CreateVehiculoSchema.extend({
  _id: ObjectIdSchema,
})

export type CreateVehiculoSchema = z.infer<typeof CreateVehiculoSchema>
export type UpdateVehiculoSchema = z.infer<typeof VehiculoSchema>
export type VehiculoSchema = z.infer<typeof VehiculoSchema>