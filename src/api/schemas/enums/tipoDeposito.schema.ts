import { z } from 'zod';

export const TipoDepositoSchema = z.enum(['propio', 'tercero'], {
    errorMap: () => ({ message: "Tipo debe ser 'propio', 'tercero' u 'otro'" }),
})

;
export type TipoDepositoSchema = z.infer<typeof TipoDepositoSchema>;