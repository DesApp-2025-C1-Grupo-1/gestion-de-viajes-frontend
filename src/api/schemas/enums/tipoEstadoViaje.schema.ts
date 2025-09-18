import { z } from 'zod';

export const TipoEstadoViajeSchema = z.enum(['iniciado', 'inicio de carga',  'fin de carga', 'fin de viaje'], {
    errorMap: () => ({ message: "Tipo debe ser 'iniciado', o 'inicio de carga', o 'fin de carga', o 'fin de viaje'" }),
})

;
export type TipoEstadoViajeSchema = z.infer<typeof TipoEstadoViajeSchema>;