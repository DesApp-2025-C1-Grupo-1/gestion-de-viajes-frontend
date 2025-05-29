import { z } from "zod"

const patenteRegex = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/

export const CreateVehiculoSchema = z.object({
  patente: z.string().regex(patenteRegex, "Formato de patente inválido"),
  marca: z.string().min(1),
  modelo: z.string().min(1),
  año: z.number().int().min(1900).max(2025),
  volumen_carga: z.number().positive(),
  peso_carga: z.number().positive(),
  tipo: z.string().regex(/^[a-f\d]{24}$/i),
  empresa: z.string().regex(/^[a-f\d]{24}$/i),
})

export const VehiculoSchema = CreateVehiculoSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
})

export type CreateVehiculoSchema = z.infer<typeof CreateVehiculoSchema>
export type VehiculoSchema = z.infer<typeof VehiculoSchema>