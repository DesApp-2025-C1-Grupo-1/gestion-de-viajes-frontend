import { z } from "zod"
import { TipoViajeSchema } from "./enums/tipoViajeSchema"

export const CreateViajeSchema = z.object({
  //fecha_llegada: z.string().datetime({message: "Formato AAAA-MM-DD"}),
  fecha_inicio: z.date(),
  fecha_llegada: z.date(),
  tipo_viaje: TipoViajeSchema,
  deposito_origen: z.string().regex(/^[a-f\d]{24}$/i,  "ID de deposito origen inválido"),
  deposito_destino: z.string().regex(/^[a-f\d]{24}$/i,  "ID de deposito destino inválido"),
  empresa: z.string().regex(/^[a-f\d]{24}$/i, "ID de empresa inválido"),
  chofer: z.string().regex(/^[a-f\d]{24}$/i, "ID de chofer inválido"),
  vehiculo: z.string().regex(/^[a-f\d]{24}$/i, "ID de vehiculo inválido"),
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
