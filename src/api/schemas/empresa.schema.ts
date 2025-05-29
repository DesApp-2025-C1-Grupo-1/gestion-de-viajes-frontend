import { z } from "zod"
import { DireccionSchema } from "./base/direccion.schema"
import { ContactoSchema } from "./base/contacto.schema"

export const createEmpresaSchema = z.object({
  razon_social: z.string().min(1),
  nombre_comercial: z.string().min(1),
  cuit: z.string().regex(/^\d{11}$/, "El CUIT debe tener 11 dígitos"),
  direccion: DireccionSchema,
  contacto: ContactoSchema,
})

export const empresaSchema = createEmpresaSchema.extend({
  _id: z.string().regex(/^[a-f\d]{24}$/i),
})

export type CreateEmpresaSchema = z.infer<typeof createEmpresaSchema>
export type EmpresaSchema = z.infer<typeof empresaSchema>
