import {z} from 'zod';
import { tipoDireccionSchema } from '../enums/tipoDireccion.schema';

export const DireccionSchema = z.object({
    id: z.string().uuid(),
    calle: z.string()
        .min(1, "Calle es requerida")
        .max(100, "Máximo 100 caracteres"),
    numero: z.string()
        .min(1, "Número es requerido")
        .max(10, "Máximo 10 caracteres"),
    ciudad: z.string()
        .min(1, "Ciudad es requerida")
        .max(50, "Máximo 50 caracteres"),
    estado_provincia: z.string()
        .min(1, "Estado/Provincia es requerido")
        .max(50, "Máximo 50 caracteres"),
    pais: z.string()
        .min(1, "País es requerido")
        .max(50, "Máximo 50 caracteres"),
    tipo: tipoDireccionSchema

})

export type Direccion = z.infer<typeof DireccionSchema>;