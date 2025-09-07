import { z } from "zod";
import { DateSchema, RequireSelectSchema } from "./commons";
import { TipoViajeSchema } from "./enums/tipoViajeSchema";

export const CreateViajeDistribucionSchema = z.object({
    fecha_inicio: DateSchema,
    empresa: RequireSelectSchema,
    deposito_origen: RequireSelectSchema,
    chofer: RequireSelectSchema,
    vehiculo: RequireSelectSchema,
    kilometros_camion: z
        .number({ required_error: "La cantidad de kilómetros es obligatoria" })
        .min(0.01, "La cantidad de kilómetros debe ser mayor o igual a 0.01"),
    remitos: z.array(z.number({ required_error: "Debe seleccionar ids de remitos" })).min(1, "Debe seleccionar al menos un remito"),
    tipo_viaje: TipoViajeSchema,
    tarifa: z.string().optional(),
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