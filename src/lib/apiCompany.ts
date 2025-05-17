import { Company } from "../types";
import { companies } from "./mock-data";

const generateId = () => Math.random().toString(36).substring(2,15)

const delay = (ms=500) => new Promise((res) => setTimeout(res, ms)) //???

export const fetchCompany = async(): Promise<Company[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return[...companies]
};

export const fetchCompanyById = async(id:string): Promise<Company> => {
    await delay()
    const found = companies.find((com) => com._id === id)
    if (!found) throw new Error("Empresa no encontrada")
    return found
};

export const createCompany = async(company: Partial<Company>): Promise<Company> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newCompany: Company = {
        _id: generateId(),
        razon_social: company.razon_social || "",
        nombre_comercial: company.nombre_comercial || "",
        cuit: company.cuit || 0,
        domicilio_fiscal: company.domicilio_fiscal || "",
        telefono: company.telefono || 0,
        mail: company.mail || "",
        nombre_contacto: company.nombre_contacto || ""
    }
    companies.push(newCompany)
    return{...newCompany}
};

export const updateCompany = async(id:string, company: Partial<Company>): Promise<Company> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const index = companies.findIndex((com) => com._id === id)
    if (index === -1) throw new Error("Empresa no encontrada")
    companies[index] = {...companies[index], ...company}
    return {...companies[index]}
};

export const deleteCompany = async(id:string) : Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500)) 

    const index = companies.findIndex((com) => com._id === id)
    if (index === -1) throw new Error("Empresa no encontrada")
    companies.splice(index,1)   
};