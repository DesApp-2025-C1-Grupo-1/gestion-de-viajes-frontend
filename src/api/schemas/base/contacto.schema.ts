import {z} from 'zod';
import { CreateTelefonoSchema } from './telefono.schema';

export const CreateContactoSchema = z.object({
    nombre: z.string()
        .min(1, "Nombre es requerido")
        .max(100, "Máximo 100 caracteres"),
    email: z.string().email("Email inválido"),
    telefono: CreateTelefonoSchema,
})
export const UpdateContactoSchema = CreateContactoSchema.extend({
    _id: z.string().uuid('El ID debe ser un UUID válido')
})

export const ContactoSchema = CreateContactoSchema.extend({
    _id: z.string().uuid('El ID debe ser un UUID válido')
});

export type ContactoSchema = z.infer<typeof ContactoSchema>;
export type CreateContactoSchema = z.infer<typeof CreateContactoSchema>;
export type UpdateContactoSchema = z.infer<typeof UpdateContactoSchema>;