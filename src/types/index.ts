import { Dayjs } from "dayjs"
// TODO usar los tipos provistos por orval :)

export interface TripResumen {
  id: string;
  fecha_inicio: string; 
  tipo_viaje: "Nacional" | "Internacional";
}


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
  cuit: string
  contacto: Contacto
  direccion: Direccion
}

export type Driver = {
  _id: string 
  nombre: string
  apellido: string
  dni: number
  fecha_nacimiento: Dayjs | null
  //fecha_nacimiento: string;
  licencia: string;
  tipo_licencia: string;
  telefono: Telefono;
  email: string;
  empresa: Company;
  vehiculo: Vehicle;
}

export type Deposit = {
  _id: string
  nombre: string
  direccion: Direccion
  lat: string
  long: string
  tipo: "propio" | "tercero"
  horario_entrada: string
  horario_salida: string
  restricciones: string
  contacto: Contacto
}

export type Contacto = {
  _id?: string
  nombre: string
  telefono: Telefono
  email: string
}

export type Telefono = {
  _id?: string
  codigo_pais: string
  codigo_area?: string
  numero: string
}

export type Direccion = {
  _id?: string
  calle: string
  numero: string
  ciudad: string
  estado_provincia: string
  pais: string
  tipo?: string
}

export type Trip = {
  _id: string
  deposito_origen: Deposit
  deposito_destino: Deposit
  fecha_inicio: Dayjs | null
  fecha_llegada: Dayjs | null
  tipo_viaje: "nacional" | "internacional"
  empresa: Company
  chofer: Driver
  vehiculo: Vehicle
}
