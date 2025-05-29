import {z} from 'zod';
import { tipoDireccionSchema } from './enums/tipoDireccion.schema';
import { DireccionSchema } from './base/direccion.schema';
import { ContactoSchema } from './base/contacto.schema';

export const createDepositoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    lat: z.number().min(-90, 'Latitud debe ser mayor o igual a -90').max(90, 'Latitud debe ser menor o igual a 90'),
    long: z.number().min(-180, 'Longitud debe ser mayor o igual a -180').max(180, 'Longitud debe ser menor o igual a 180'),
    tipo: tipoDireccionSchema,
    direccion: DireccionSchema,
    contacto: ContactoSchema,
    restricciones: z.string().optional(),
    horario_entrada: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm inválido"),
    horario_salida: z.string().regex(/^\d{2}:\d{2}$/, "Formato HH:mm inválido"),

});

export const depositoSchema = createDepositoSchema.extend({
    id: z.string().uuid('El ID debe ser un UUID válido'),
});

export type CreateDepositoSchema = z.infer<typeof createDepositoSchema>;
export type DepositoSchema = z.infer<typeof depositoSchema>;