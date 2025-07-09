import { z } from "zod"



//probar-------------
import { tipoLicenciaSchema } from "./enums/tipoLicencia.schema"



// Reutilizable para todos los campos que usan ObjectId
export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "ID inválido (esperado ObjectId de 24 caracteres hexadecimales)")

export const DateSchema = z.date({
    required_error: "La fecha es obligatoria",
    invalid_type_error: "Debe ser una fecha válida",
})

export const RequireSelectSchema = z
    .string({required_error: "El campo es obligatorio"})
    .min(1, "Debes seleccionar una opción")
    


//intento-----------------------------------------------------------------------
// esquema para validacion de licencias en select
export const LicenciaVehiculoSchema = z.object({
  tipo_licencia: tipoLicenciaSchema, // Reutiliza el mismo schema
  vehiculo_id: ObjectIdSchema
}).superRefine(async (data, ctx) => {
  if (!data.vehiculo_id) return; // No validar si no hay vehículo
  
  const res = await fetch(`/api/vehiculos/${data.vehiculo_id}/licencias`);
  const { licencias } = await res.json();
  
  if (!licencias.includes(data.tipo_licencia)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Licencia ${data.tipo_licencia} no válida para este vehículo`,
      path: ["vehiculo"],
    });
  }
});