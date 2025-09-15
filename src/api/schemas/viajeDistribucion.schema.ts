import { z } from "zod";
import { DateSchema, RequireSelectSchema } from "./commons";
import { TipoViajeSchema } from "./enums/tipoViajeSchema";

export const CreateViajeDistribucionSchema = z.object({
    fecha_inicio: DateSchema,
    transportista: RequireSelectSchema,
    origen: RequireSelectSchema,
    chofer: RequireSelectSchema,
    vehiculo: RequireSelectSchema,
    kilometros: z
        .number({ required_error: "La cantidad de kilómetros es obligatoria" })
        .min(0.01, "La cantidad de kilómetros debe ser mayor o igual a 0.01"),
    remito_ids: z.array(z.number({ required_error: "Debe seleccionar ids de remitos" })).min(1, "Debe seleccionar al menos un remito"),
    tipo_viaje: TipoViajeSchema,
    tarifa_id: z.string().optional(),
    estado: z.string().optional(),
    observaciones: z.string().max(500, "Las observaciones no pueden superar los 500 caracteres").optional(),
});

export const ViajeDistribucionUpdateSchema = CreateViajeDistribucionSchema.extend({
    id: z.string().uuid(),
});

export const ViajeDistribucionSchema = CreateViajeDistribucionSchema.extend({
    id: z.string().uuid(),
});

export type CreateViajeDistribucionSchema = z.infer<typeof CreateViajeDistribucionSchema>;
export type UpdateViajeDistribucionSchema = z.infer<typeof ViajeDistribucionUpdateSchema>;
export type ViajeDistribucionSchema = z.infer<typeof ViajeDistribucionSchema>;