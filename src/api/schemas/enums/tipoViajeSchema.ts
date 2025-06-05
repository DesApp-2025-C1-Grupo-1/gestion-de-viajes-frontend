import { z } from 'zod';

export const TipoViajeSchema = z.enum(['nacional', 'internacional'], {
    errorMap: () => ({ message: "Tipo debe ser 'nacional', o 'internacional'" }),
})

;
export type TipoViajeSchema = z.infer<typeof TipoViajeSchema>;