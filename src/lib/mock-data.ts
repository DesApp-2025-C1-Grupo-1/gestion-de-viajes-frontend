import { Vehicle, VehicleType, Driver, Company} from "../types";

export const driverTypes: Driver[] = [
  {
    "_id": "dri1",
    "nombre": "Carlos",
    "apellido": "Gutierrez",
    "dni": 17295772,
    "fecha_nacimiento": null,
    "empresa": "Transportes Rápidos SA", //aca deberia manejar el ID (cambiar)
    "vehiculo": "9483",
    "licencia": 12345,
    "tipo_licencia": "A1",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  },
  {
    "_id": "dri2",
    "nombre": "Esteban",
    "apellido": "Rodriguez",
    "dni": 25637829,
    "fecha_nacimiento": null,
    "empresa": "Lógista Express", //aca deberia manejar el ID (cambiar)
    "vehiculo": "3856",
    "licencia": 12345,
    "tipo_licencia": "A2",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  },
  {
    "_id": "dri3",
    "nombre": "Marcos",
    "apellido": "Bustamante",
    "dni": 37896521,
    "fecha_nacimiento": null,
    "empresa": "Transportes del Sur", //aca deberia manejar el ID (cambiar)
    "vehiculo": "1274",
    "licencia": 12345,
    "tipo_licencia": "A3",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  },
  {
    "_id": "dri4",
    "nombre": "Laura",
    "apellido": "Fernandez",
    "dni": 41235678,
    "fecha_nacimiento": null,
    "empresa": "Distribuciones Andinas", //aca deberia manejar el ID (cambiar)
    "vehiculo": "9374",
    "licencia": 12345,
    "tipo_licencia": "A4",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  },
  {
    "_id": "dri5",
    "nombre": "Carlos",
    "apellido": "Gomez",
    "dni": 39785632,
    "fecha_nacimiento": null,
    "empresa": "Cargas Patagónicas", //aca deberia manejar el ID (cambiar)
    "vehiculo": "5621",
    "licencia": 12345,
    "tipo_licencia": "A5",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  },
  {
    "_id": "dri6",
    "nombre": "Sofia",
    "apellido": "Martinez",
    "dni": 42896321,
    "fecha_nacimiento": null,
    "empresa": "Norte Cargo", //aca deberia manejar el ID (cambiar)
    "vehiculo": "2145",
    "licencia": 12345,
    "tipo_licencia": "A6",
    "telefono": 1155990556,
    "email": "chofer@gmail.com"
  }
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
    empresa: "Distribuciones andina",
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
    empresa: "Transportes del Sur",
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
    empresa: "Transportes del Sur",
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
    empresa: "Transportes Rápidos SA",
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
    empresa: "Lógista Express",
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
    empresa: "Transportes Rápidos SA",
  }
]

export const companies: Company[] = [
  {
    _id:"com1",
    razon_social:"Transportes Rápidos sociedad anónima",
    nombre_comercial:"Transportes Rápidos SA",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com2",
    razon_social:"Lógista Express",
    nombre_comercial:"Lógista Express",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com3",
    razon_social:"Transportes del Sur",
    nombre_comercial:"Transportes del Sur",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com4",
    razon_social:"Distribuciones andinas sociedad",
    nombre_comercial:"Distribuciones andinas",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com5",
    razon_social:"Cargas Patagónicas",
    nombre_comercial:"Cargas Patagónicas",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com6",
    razon_social:"Transportes Rápidos sociedad anónima",
    nombre_comercial:"Transportes Rápidos SA",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  },
  {
    _id:"com7",
    razon_social:"Norte cargo logística",
    nombre_comercial:"Norte cargo",
    cuit: 30-123456-9,
    domicilio_fiscal:"Av Principal 123",
    telefono: 1155990776,
    mail: "contacto@empresa.com",
    nombre_contacto: "Administrador"
  }
]

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