import {z} from 'zod';
import { CreateDireccionSchema } from './base/direccion.schema';
import { CreateContactoSchema } from './base/contacto.schema';
import { TipoDepositoSchema } from './enums/tipoDeposito.schema';

export const CreateDepositoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    lat: z.number().min(-90, 'Latitud debe ser mayor o igual a -90').max(90, 'Latitud debe ser menor o igual a 90'),
    long: z.number().min(-180, 'Longitud debe ser mayor o igual a -180').max(180, 'Longitud debe ser menor o igual a 180'),
    tipo: TipoDepositoSchema,
    direccion: CreateDireccionSchema,
    contacto: CreateContactoSchema,
    restricciones: z.string().min(1, 'Las restricciones son obligatorias'),
    horario_entrada: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm inválido"),
    horario_salida: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm inválido"),

});

export const DepositoSchema = CreateDepositoSchema.extend({
    _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de deposito inválido (esperado ObjectId de 24 caracteres hexadecimales)"),
});

export const UpdateDepositoSchema = CreateDepositoSchema.extend({
    _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de deposito inválido (esperado ObjectId de 24 caracteres hexadecimales)"),
});

export type CreateDepositoSchema = z.infer<typeof CreateDepositoSchema>;
export type DepositoSchema = z.infer<typeof DepositoSchema>;
export type UpdateDepositoSchema = z.infer<typeof UpdateDepositoSchema>;