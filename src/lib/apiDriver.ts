import dayjs, { Dayjs } from "dayjs";
import { Driver } from "../types";
import { driverTypes } from './mock-data';

//id
const generateId = () => Math.random().toString(36).substring(2, 15)

//fetch
export const fetchDrivers = async(): Promise<Driver[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return[...driverTypes]
};

//create chofer
export const createDriver = async(driver: Partial<Driver>): Promise<Driver> => {
    await new Promise((resolve) => setTimeout(resolve,500))

    const newDriver: Driver = {
        _id: generateId(),
        nombre: driver.nombre || "",
        apellido: driver.apellido || "",
        dni: driver.dni || 0,
        fecha_nacimiento: driver.fecha_nacimiento || dayjs(),
        empresa: driver.empresa || "",
        vehiculo: driver.vehiculo || "",
        licencia: driver.licencia || 0,
        tipo_licencia: driver.tipo_licencia || "",
        telefono: driver.telefono || 0,
        email: driver.email || ""
      }
      driverTypes.push(newDriver)
      return { ...newDriver }
};

//update chofer
export const updateDriver = async(id:string, driver: Partial<Driver>): Promise<Driver> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const index = driverTypes.findIndex((dri) => dri._id === id)
    if (index === -1) throw new Error("Driver not found")
    driverTypes[index] = {...driverTypes[index], ...driver}
    return {...driverTypes[index]}
};

//delete chofer
export const deleteDriver = async(id:string) : Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const index = driverTypes.findIndex((dri) => dri._id === id)
    if (index === -1) throw new Error("Driver not found")
    driverTypes.splice(index,1)
};

export const fetchDriverById = async(id:string): Promise<Driver> => {
    await delay()
    const found = driverTypes.find((dri) => dri._id === id)
    if (!found) throw new Error("Driver not found")
    return found
}

const delay = (ms=500) => new Promise((res) => setTimeout(res, ms))