import { Vehicle, VehicleType } from "../types"
import { vehicleTypes, vehicles } from "./mock-data"

// Generar un ID aleatorio para los tipos de vehículos
const generateId = () => Math.random().toString(36).substring(2, 15)

// Simular una llamada a la API para obtener los tipos de vehículos
export const fetchVehicleTypes = async (): Promise<VehicleType[]> => {
  // Simular un retraso en la llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...vehicleTypes]
}

// Vehicle Types CRUD
export const createVehicleType = async (vehicleType: Partial<VehicleType>): Promise<VehicleType> => {
  // Simular un retraso en la llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newVehicleType: VehicleType = {
    _id: generateId(),
    name: vehicleType.name || "",
    description: vehicleType.description,
  }

  vehicleTypes.push(newVehicleType)
  return { ...newVehicleType }
}

export const updateVehicleType = async (id: string, vehicleType: Partial<VehicleType>): Promise<VehicleType> => {
  // Simular un retraso en la llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = vehicleTypes.findIndex((vt) => vt._id === id)
  if (index === -1) throw new Error("Vehicle type not found")

  vehicleTypes[index] = { ...vehicleTypes[index], ...vehicleType }
  return { ...vehicleTypes[index] }
}

export const deleteVehicleType = async (id: string): Promise<void> => {
  // Simular un retraso en la llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 500))

  const index = vehicleTypes.findIndex((vt) => vt._id === id)
  if (index === -1) throw new Error("Vehicle type not found")

 /*  // Verificar si el tipo de vehículo está siendo utilizado por algún vehículo
  const vehiclesUsingType = vehicles.some((v) => v.type === vehicleTypes[index].name)
  if (vehiclesUsingType) {
    throw new Error("No se puede eliminar este tipo de vehículo porque está siendo utilizado por uno o más vehículos")
  } */

  vehicleTypes.splice(index, 1)
  return
}


export const fetchVehicle = async (): Promise<Vehicle[]> => {
  // Simular un retraso en la llamada a la API
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...vehicles]
}

export const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  await delay()
  const found = vehicles.find((v) => v._id === id)
  if (!found) throw new Error("Vehículo no encontrado")
  return found
}

export const createVehicle = async (data: Omit<Vehicle, "_id">): Promise<Vehicle> => {
  await delay()
  const newVehicle: Vehicle = { ...data, _id: generateId() }
  vehicles.push(newVehicle)
  return newVehicle
}

export const updateVehicle = async (id: string, data: Omit<Vehicle, "_id">): Promise<Vehicle> => {
  await delay()
  const index = vehicles.findIndex((v) => v._id === id)
  if (index === -1) throw new Error("Vehículo no encontrado")
  vehicles[index] = { ...data, _id: id }
  return vehicles[index]
}

export const deleteVehicle = async (id: string): Promise<void> => {
  await delay()
  const index = vehicles.findIndex((v) => v._id === id)
  if (index === -1) throw new Error("Vehículo no encontrado")
  vehicles.splice(index, 1)
}

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms))