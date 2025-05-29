import { z } from "zod"

export const createTipoVehiculoSchema = z.object({
  nombre: z.string().min(1).max(100),
  descripcion: z.string().min(1).max(255),
})

export const tipoVehiculoSchema = createTipoVehiculoSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
})

export type CreateTipoVehiculoSchema = z.infer<typeof createTipoVehiculoSchema>
export type TipoVehiculoSchema = z.infer<typeof tipoVehiculoSchema>