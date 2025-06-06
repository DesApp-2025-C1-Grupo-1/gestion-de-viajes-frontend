import { z } from "zod"

// Reutilizable para todos los campos que usan ObjectId
export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID inválido (esperado ObjectId de 24 caracteres hexadecimales)")

export const DateSchema = z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
})

export const RequireSelectSchema = z
    .string({required_error: "El campo es obligatorio"})
    .min(1, "Debes seleccionar una opción")
    

