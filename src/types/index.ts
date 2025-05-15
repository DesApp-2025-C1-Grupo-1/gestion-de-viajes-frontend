
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
