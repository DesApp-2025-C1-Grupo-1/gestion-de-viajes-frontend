import { z } from 'zod';

export const tipoLicenciaSchema = z.enum([
  'A1.1', 'A1.2', 'A1.3', 'A1.4',
  'A2.1', 'A2.2', 'A3',
  'B1', 'B2',
  'C1', 'C2', 'C3',
  'D1', 'D2', 'D3', 'D4',
  'E1', 'E2',
  'F',
  'G1', 'G2', 'G3'
]);

export type TipoLicenciaSchema = z.infer<typeof tipoLicenciaSchema>;