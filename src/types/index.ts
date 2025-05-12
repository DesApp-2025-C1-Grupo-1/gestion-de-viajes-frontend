import { Dayjs } from "dayjs"

export type VehicleType = {
  _id: string
  name: string
  description?: string
}

export type DriverType = {
  _id: string 
  name: string
  surname: string
  dni: number
  date_birth: Dayjs | null
  company: number
  vehicle: number
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
