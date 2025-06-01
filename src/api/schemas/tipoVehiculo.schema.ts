import { z } from "zod";
import { CreateTipoVehiculoDto, TipoVehiculoDto, UpdateTipoVehiculoDto } from "../generated";

// Validación de ObjectId de MongoDB
const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID inválido");

// Schema para creación (CreateTipoVehiculoDto)
export const createTipoVehiculoSchema = z.object({
  nombre: z.string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .refine(val => val.trim().length > 0, "No puede contener solo espacios"),
  descripcion: z.string()
    .max(200, "Máximo 200 caracteres")
}) satisfies z.ZodType<CreateTipoVehiculoDto>;

// Schema para actualización (UpdateTipoVehiculoDto)
export const updateTipoVehiculoSchema = z.object({
  nombre: z.string()
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres")
    .refine(val => val.trim().length > 0, "No puede contener solo espacios")
    .optional(),
  descripcion: z.string()
    .max(200, "Máximo 200 caracteres")
    .optional()
}).refine(data => Object.keys(data).length > 0, {
  message: "Debe enviar al menos un campo para actualizar"
}) satisfies z.ZodType<UpdateTipoVehiculoDto>;

// Schema para lectura (TipoVehiculoDto)
export const tipoVehiculoSchema = z.object({
  _id: objectIdSchema,
  nombre: z.string(),
  descripcion: z.string()
}) satisfies z.ZodType<TipoVehiculoDto>;

// Tipos inferidos
export type CreateTipoVehiculoForm = z.infer<typeof createTipoVehiculoSchema>;
export type UpdateTipoVehiculoForm = z.infer<typeof updateTipoVehiculoSchema>;
export type TipoVehiculoForm = z.infer<typeof tipoVehiculoSchema>;