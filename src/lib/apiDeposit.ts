import { Deposit } from "../types"
import { deposits } from "./mock-data"

const generateId = () => Math.random().toString(36).substring(2, 15)

const delay = (ms = 500) => new Promise((res) => setTimeout(res, ms))

export const fetchDeposits = async (): Promise<Deposit[]> => {
    await delay()
    return [...deposits]
}

export const fetchDepositById = async (id: string): Promise<Deposit> => {
    await delay()
    const found = deposits.find((d) => d._id === id)
    if (!found) throw new Error("Depósito no encontrado")
    return found
}

export const createDeposit = async (data: Omit<Deposit, "_id">): Promise<Deposit> => {
    await delay()
    const newDeposit: Deposit = { ...data, _id: generateId() }
    deposits.push(newDeposit)
    return newDeposit
}

export const updateDeposit = async (id: string, data: Omit<Deposit, "_id">): Promise<Deposit> => {
    await delay()
    const index = deposits.findIndex((d) => d._id === id)
    if (index === -1) throw new Error("Depósito no encontrado")
    deposits[index] = { ...data, _id: id }
    return deposits[index]
}

export const deleteDeposit = async (id: string): Promise<void> => {
    await delay()
    const index = deposits.findIndex((d) => d._id === id)
    if (index === -1) throw new Error("Depósito no encontrado")
    deposits.splice(index, 1)
}
