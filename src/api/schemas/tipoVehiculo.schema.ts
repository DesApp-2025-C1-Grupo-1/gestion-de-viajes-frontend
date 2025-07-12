import { z } from "zod";
import { CreateTipoVehiculoDto} from "../generated";
import { ObjectIdSchema } from "./commons";
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema";

export const createTipoVehiculoSchema = z.object({
  nombre: z.string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .refine(val => val.trim().length > 0, "No puede contener solo espacios"),
  descripcion: z.string()
    .max(200, "Máximo 200 caracteres"),
  licencia_permitida: tipoLicenciaSchema,
}) satisfies z.ZodType<Pick<CreateTipoVehiculoDto, 'nombre' | 'descripcion'> & { licencia_permitida: string }>;

export const updateTipoVehiculoSchema = z.object({
  nombre: z.string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .refine(val => val.trim().length > 0, "No puede contener solo espacios")
    .optional(),
  descripcion: z.string()
    .max(200, "Máximo 200 caracteres")
    .optional(),
  licencia_permitida: tipoLicenciaSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar"
}) ;

export const tipoVehiculoSchema = z.object({
  _id: ObjectIdSchema,
  nombre: z.string(),
  descripcion: z.string(),
  licencia_permitida: tipoLicenciaSchema,
}) ;

// Tipos inferidos
export type CreateTipoVehiculoForm = z.infer<typeof createTipoVehiculoSchema>;
export type UpdateTipoVehiculoForm = z.infer<typeof updateTipoVehiculoSchema>;
export type TipoVehiculoForm = z.infer<typeof tipoVehiculoSchema>;