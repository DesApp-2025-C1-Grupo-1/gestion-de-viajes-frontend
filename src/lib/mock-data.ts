import { Company, Vehicle, VehicleType } from "../types";

export const vehicleTypes: VehicleType[] = [
  {
    _id: "vtype1",
    name: "Camión Articulado",
    description: "Camión con remolque articulado",
  },
  {
    _id: "vtype2",
    name: "Camión Rígido",
    description: "Camión sin remolque",
  },
  {
    _id: "vtype3",
    name: "Furgón",
    description: "Vehículo cerrado para transporte de mercancías",
  },
  {
    _id: "vtype4",
    name: "Camioneta",
    description: "Vehículo ligero para transporte de mercancías",
  },
  {
    _id: "vtype5",
    name: "Tractor con Semirremolque",
    description: "Combinación de tractor y semirremolque",
  },
]

export const vehicles: Vehicle[] = [
  {
    _id: "veh1",
    patente: "ABC123",
    modelo: "Toyota",
    marca: "Toyota",
    año: 2020,
    volumen_carga: 1000,
    peso_carga: 1500,
    tipo: "Camión Articulado",
    empresa: "Transportista A",
  },
  {
    _id: "veh2",
    patente: "DEF456",
    modelo: "Ford",
    marca: "Ford",
    año: 2019,
    volumen_carga: 1500,
    peso_carga: 2000,
    tipo: "Camioneta",
    empresa: "Transportista B",
  },
  {
    _id: "veh3",
    patente: "GHI789",
    modelo: "Chevrolet",
    marca: "Chevrolet",
    año: 2021,
    volumen_carga: 1200,
    peso_carga: 1800,
    tipo: "Tractor con Semirremolque",
    empresa: "Transportista C",
  },
  {
    _id: "veh4",
    patente: "JKL012",
    modelo: "Nissan",
    marca: "Nissan",
    año: 2022,
    volumen_carga: 800,
    peso_carga: 1200,
    tipo: "Camión Articulado",
    empresa: "Transportista D",
  },
  {
    _id: "veh5",
    patente: "MNO345",
    modelo: "Hyundai",
    marca: "Hyundai",
    año: 2023,
    volumen_carga: 900,
    peso_carga: 1300,
    tipo: "Camión Rígido",
    empresa: "Transportista E",
  },
  {
    _id: "veh6",
    patente: "PQR678",
    modelo: "Kia",
    marca: "Kia",
    año: 2020,
    volumen_carga: 1100,
    peso_carga: 1600,
    tipo: "Camión Articulado",
    empresa: "Transportista F",
  }
]

export const empresas: Company[] = [
  {
    _id: "comp1",
    name: "Transportista A",
    trade_name: "TransA",
    cuit: "20-12345678-9",
    address: "Calle Falsa 123",
    phone: "1234-5678",
    email: "prueba@gmail.com",
    drivers: [
      {
        _id: "driver1",
        name: "Juan Pérez",
      },
      {
        _id: "driver2",
        name: "María López",
      },
    ],
  },
  {
    _id: "comp2",
    name: "Transportista B",
    trade_name: "TransB",
    cuit: "20-23456789-0",
    address: "Avenida Siempre Viva 456",
    phone: "2345-6789",
    email: "test@gmail.com",
    drivers: [
      {
        _id: "driver3",
        name: "Carlos García",
      },
      {
        _id: "driver4",
        name: "Ana Martínez",
      },
    ],
  },
  {
    _id: "comp3",
    name: "Transportista C",
    trade_name: "TransC",
    cuit: "20-34567890-1",
    address: "Boulevard de los Sueños Rotos 789",
    phone: "3456-7890",
    email: "fasfs@gmail.com",
    drivers: [
      {
        _id: "driver5",
        name: "Luis Fernández",
      },
      {
        _id: "driver6",
        name: "Laura González",
      },
    ],
  },
]