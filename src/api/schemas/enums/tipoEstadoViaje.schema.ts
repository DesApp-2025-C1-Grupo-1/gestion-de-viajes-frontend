import { z } from 'zod';

export const TipoEstadoViajeSchema = z.enum(['iniciado', 'cargando',  'cargado', 'finalizado'], {
    errorMap: () => ({ message: "Tipo debe ser 'iniciado', o 'cargando'" }),
})

;
export type TipoEstadoViajeSchema = z.infer<typeof TipoEstadoViajeSchema>;