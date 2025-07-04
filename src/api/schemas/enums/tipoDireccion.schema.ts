import { z } from 'zod';

export const tipoDireccionSchema = z.enum(['fiscal', 'deposito'], {
    errorMap: () => ({ message: "Tipo debe ser 'fiscal', 'deposito' u 'otro'" }),
})

;
export type TipoDireccionSchema = z.infer<typeof tipoDireccionSchema>;