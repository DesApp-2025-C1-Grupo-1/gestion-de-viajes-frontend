import { z } from "zod"
import { TipoViajeSchema } from "./enums/tipoViajeSchema"
import { DateSchema, ObjectIdSchema } from "./commons";


export const BaseViajeSchema = z.
  object({
    fecha_inicio: DateSchema,
    fecha_llegada: DateSchema,
    tipo_viaje: TipoViajeSchema,
    deposito_origen: ObjectIdSchema,
    deposito_destino: ObjectIdSchema,
    empresa: ObjectIdSchema,
    chofer: ObjectIdSchema,
    vehiculo: ObjectIdSchema,
})

export const CreateViajeSchema = BaseViajeSchema
  .refine((data) => data.fecha_llegada > data.fecha_inicio, {
    message: "La fecha de llegada debe ser posterior a la fecha de inicio",
    path: ["fecha_llegada"],
  })
  .refine((data) => data.deposito_origen !== data.deposito_destino, {
  message: "El depósito de origen y destino no pueden ser iguales",
  path: ["deposito_destino"],
  })

export const ViajeSchema = BaseViajeSchema.extend({
    _id: ObjectIdSchema,
});

export const UpdateViajeSchema = BaseViajeSchema
  .extend({
    _id: ObjectIdSchema,
  })
  .refine((data) => data.fecha_llegada > data.fecha_inicio, {
    message: "La fecha de llegada debe ser posterior a la fecha de inicio",
    path: ["fecha_llegada"],
  })
  .refine((data) => data.deposito_origen !== data.deposito_destino, {
  message: "El depósito de origen y destino no pueden ser iguales",
  path: ["deposito_destino"],
  })


export type CreateViajeSchema = z.infer<typeof CreateViajeSchema>
export type UpdateViajeSchema = z.infer<typeof UpdateViajeSchema>
export type ViajeSchema = z.infer<typeof ViajeSchema>
