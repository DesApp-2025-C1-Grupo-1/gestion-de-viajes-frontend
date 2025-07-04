import {z} from 'zod';

export const CreateTelefonoSchema = z.object({
    codigo_pais: z.string()
        .min(1, "Código de país es requerido")	
        .regex(/^\d+$/, "El código de país debe contener solo números"),
    codigo_area: z.string()
        .optional()
        .refine((val) => val === undefined || val.length === 0 || /^\d+$/.test(val), {
            message: "Código de área debe ser numérico o vacío",
        }),
    numero: z.string()
        .min(6, "El número debe tener al menos 6 dígitos")
        .max(20)
        .regex(/^\d+$/, "El número debe contener solo números"),
});

export const TelefonoSchema = CreateTelefonoSchema.extend({
    _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de telefono inválido (esperado ObjectId de 24 caracteres hexadecimales)"),
});

export const UpdateTelefonoSchema = CreateTelefonoSchema.extend({
    _id: z.string().regex(/^[a-f\d]{24}$/i, "ID de telefono inválido (esperado ObjectId de 24 caracteres hexadecimales)"),
});

export type TelefonoSchema = z.infer<typeof TelefonoSchema>;    
export type CreateTelefonoSchema = z.infer<typeof CreateTelefonoSchema>;
export type UpdateTelefonoSchema = z.infer<typeof UpdateTelefonoSchema>;