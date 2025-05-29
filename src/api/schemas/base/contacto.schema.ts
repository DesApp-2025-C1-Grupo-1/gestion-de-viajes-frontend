import {z} from 'zod';
import { TelefonoSchema } from './telefono.schema';

export const ContactoSchema = z.object({
    id: z.string().uuid(),
    nombre: z.string()
        .min(1, "Nombre es requerido")
        .max(100, "Máximo 100 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: TelefonoSchema
})

export type Contacto = z.infer<typeof ContactoSchema>;