import { z } from "zod"

export const createViajeSchema = z.object({
  fecha_inicio: z.string().datetime({ message: "Formato ISO inválido" }),
  fecha_llegada: z.string().datetime({ message: "Formato ISO inválido" }),
  tipo_viaje: z.enum(["nacional", "internacional"]),
  deposito_origen: z.string().regex(/^[a-f\d]{24}$/i),
  deposito_destino: z.string().regex(/^[a-f\d]{24}$/i),
  empresa: z.string().regex(/^[a-f\d]{24}$/i),
  chofer: z.string().regex(/^[a-f\d]{24}$/i),
  vehiculo: z.string().regex(/^[a-f\d]{24}$/i),
})

export const viajeSchema = createViajeSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
})

export type CreateViajeSchema = z.infer<typeof createViajeSchema>
export type ViajeSchema = z.infer<typeof viajeSchema>
