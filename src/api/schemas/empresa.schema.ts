import { z } from "zod"
import { CreateDireccionSchema } from "./base/direccion.schema"
import { CreateContactoSchema } from "./base/contacto.schema"

export const CreateEmpresaSchema = z.object({
  razon_social: z.string().min(1 , "La razón social es obligatoria"),
  nombre_comercial: z.string().min(1, "El nombre comercial es obligatorio"),
  cuit: z.string().regex(/^\d{11}$/, "El CUIT debe tener 11 dígitos"),
  direccion: CreateDireccionSchema,
  contacto: CreateContactoSchema,
})

export const EmpresaSchema = CreateEmpresaSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "Formato de ID de empresa inválido"),
})

export const UpdateEmpresaSchema = CreateEmpresaSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i, "Formato de ID de empresa inválido"),
})

export type CreateEmpresaSchema = z.infer<typeof CreateEmpresaSchema>
export type UpdateEmpresaSchema = z.infer<typeof UpdateEmpresaSchema>
export type EmpresaSchema = z.infer<typeof EmpresaSchema>
