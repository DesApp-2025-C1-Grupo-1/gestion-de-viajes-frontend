import { z } from "zod"
import { TipoViajeSchema } from "./enums/tipoViajeSchema"

export const CreateViajeSchema = z.object({
  fecha_inicio: z.string().datetime({ message: "Formato ISO inválido" }),
  fecha_llegada: z.string().datetime({ message: "Formato ISO inválido" }),
  //tipo_viaje: z.enum(["nacional", "internacional"]),
  tipo_viaje: TipoViajeSchema,
  deposito_origen: z.string().regex(/^[a-f\d]{24}$/i),
  deposito_destino: z.string().regex(/^[a-f\d]{24}$/i),
  empresa: z.string().regex(/^[a-f\d]{24}$/i, "ID de empresa inválido"),
  chofer: z.string().regex(/^[a-f\d]{24}$/i, "ID de chofer inválido"),
  vehiculo: z.string().regex(/^[a-f\d]{24}$/i, "ID de vehiculo inválido"),
  //empresa: z.string().regex(/^[a-f\d]{24}$/i),
  //chofer: z.string().regex(/^[a-f\d]{24}$/i),
  //vehiculo: z.string().regex(/^[a-f\d]{24}$/i),
})

export const ViajeSchema = CreateViajeSchema.extend({
    _id: z.string().uuid('El ID debe ser un UUID válido'),
});

export const UpdateViajeSchema = CreateViajeSchema.extend({
    _id: z.string().uuid('El ID debe ser un UUID válido'),
});


export type CreateViajeSchema = z.infer<typeof CreateViajeSchema>
export type UpdateViajeSchema = z.infer<typeof UpdateViajeSchema>
export type ViajeSchema = z.infer<typeof ViajeSchema>
