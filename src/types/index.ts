import { Dayjs } from "dayjs"
// TODO usar los tipos provistos por orval :)
export type VehicleType = {
  _id: string
  name: string
  description?: string
}

export type Vehicle = {
  _id: string
  patente: string
  modelo: string
  marca: string
  año: number
  volumen_carga: number
  peso_carga: number
  tipo: string
  empresa: string
}

export type Company = {
  _id: string
  razon_social: string
  nombre_comercial: string
  cuit: number
  domicilio_fiscal: string
  telefono: number
  mail: string
  nombre_contacto: string
}

export type Driver = {
  _id: string 
  nombre: string
  apellido: string
  dni: number
  fecha_nacimiento: Dayjs | null
  empresa: string
  vehiculo: string
  licencia: number
  tipo_licencia: string
  telefono: number
  email: string
}


