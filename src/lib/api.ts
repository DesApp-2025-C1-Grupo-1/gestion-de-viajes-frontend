import { VehicleType } from "../types"
import { vehicleTypes } from "./mock-data"

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
