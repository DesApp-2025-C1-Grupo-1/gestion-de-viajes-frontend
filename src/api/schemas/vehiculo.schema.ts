import { z } from "zod"
import { ObjectIdSchema, RequireSelectSchema } from "./commons"

const patenteRegex = /^[A-Z]{2,3}\d{3,4}[A-Z]{0,2}$/; // Más flexible

export const CreateVehiculoSchema = z.object({
  patente: z.string().min(1, "La patente es requerida").regex(patenteRegex, "Formato de patente inválido (Ej: ABC123 o AB123CD)"),
  marca: z.string().min(1, "La marca es requerida"),
  modelo: z.string().min(1, "El modelo es requerido"),
  año: z.number()
    .int("El año debe ser un número entero")
    .min(1900, "El año tiene que ser mayor a 1900")
    .max(new Date().getFullYear(), "El año no puede ser mayor al actual"),
  volumen_carga: z
    .number({ required_error: "El volumen es obligatorio" })
    .min(0.01, "El volumen debe ser mayor o igual a 0.01 metros cúbicos"),
  peso_carga: z
    .number({ required_error: "El peso es obligatorio" })
    .min(0.01, "El peso debe ser mayor o igual a 0.01 kilogramos"),
  tipo: RequireSelectSchema,
  empresa: RequireSelectSchema,
})

export const VehiculoSchema = CreateVehiculoSchema.extend({
  _id: ObjectIdSchema,
})

export type CreateVehiculoSchema = z.infer<typeof CreateVehiculoSchema>
export type UpdateVehiculoSchema = z.infer<typeof VehiculoSchema>
export type VehiculoSchema = z.infer<typeof VehiculoSchema>