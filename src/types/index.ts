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

export type VehicleDriver = {
  _id: string
  name: string
}

export type CompanyDriver = {
  _id: string
  name: string
}
export type Company = {
  _id: string
  name: string
  trade_name: string
  cuit: string
  address: string
  phone: string
  email: string
  drivers: CompanyDriver[]
}