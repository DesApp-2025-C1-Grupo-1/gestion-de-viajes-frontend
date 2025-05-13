import dayjs, { Dayjs } from "dayjs";
import { DriverType } from "../types";
import { driverTypes } from './mock-data';

//id
const generateId = () => Math.random().toString(36).substring(2, 15)

//fetch
export const fetchDrivers = async(): Promise<DriverType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return[...driverTypes]
};

//create chofer
export const createDriver = async(driver: Partial<DriverType>): Promise<DriverType> => {
    await new Promise((resolve) => setTimeout(resolve,500))

    const newDriver: DriverType = {
        _id: generateId(),
        name: driver.name || "",
        surname: driver.surname || "",
        dni: driver.dni || 0,
        date_birth: driver.date_birth || dayjs(),
        company: driver.company || "",
        vehicle: driver.vehicle || "",
        licence: driver.licence || 0,
        typeLicence: driver.typeLicence || "",
        telephone: driver.telephone || 0,
        email: driver.email || ""
      }
      driverTypes.push(newDriver)
      return { ...newDriver }
};

//update chofer
export const updateDriver = async(id:string, driver: Partial<DriverType>): Promise<DriverType> => {
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
    return
};
