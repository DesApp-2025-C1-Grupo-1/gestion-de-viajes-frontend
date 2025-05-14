import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography} from "@mui/material";
import { CompanyDriver, Vehicle, VehicleDriver } from "../../types";

interface FormDriverProps{
    onSubmit: (formData: Partial<Vehicle>) => void;
    editingVehicle?: Vehicle | null;
    isEditing?: boolean;
    onCancel?: () => void; 
    companies?: CompanyDriver[]; 
    vehicles?: VehicleDriver[];
}

export const FormVehicle = ({onSubmit, editingVehicle, onCancel, isEditing, companies} : FormDriverProps) => {
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        patente: "",
        modelo: "",
        marca: "",
        tipo: "",
        empresa: "",
        año: 0,
        peso_carga: 0,
        volumen_carga: 0,
    });

    useEffect(() => {
        if(isEditing && editingVehicle){
            setFormData(editingVehicle)
        }
    }, [isEditing, editingVehicle]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;
        let valueFormatted: string | number | Date; //ver capaz podria ir como un tipo en la interfaz
        switch(type){
            case "number":
                valueFormatted = Number(value)
                break;
            default:
                valueFormatted = value;
        }
        setFormData(prev => ({...prev, [name]: valueFormatted}))
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return(
        <Paper  sx={{padding:3, maxWidth: '100%', mx:'auto', borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}}>
            <form onSubmit={handleSubmit} className="flex flex-col ">
                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>
                <Box sx={{ display: "flex", flexFlow:"wrap", gap: 5, mb: 6 }}> 
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: "300px", width: "100%"}}> 
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Patente</Typography>
                        <TextField className="inside-paper" name="patente" placeholder="Ingresar" value={formData.patente} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1,  width: "100%", maxWidth: "300px"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Modelo</Typography>
                        <TextField className="inside-paper" name="modelo" placeholder="Ingresar" value={formData.modelo} onChange={handleChange} fullWidth />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: "300px", width: "100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Marca</Typography>
                        <TextField className="inside-paper" name="marca" placeholder="Ingresar" value={formData.marca} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: "300px", width: "100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Año</Typography>
                        <TextField className="inside-paper" name="año" placeholder="Ingresar" value={formData.año} onChange={handleChange} fullWidth />
                    </Box>
                </Box>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: "300px", width: "100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Empresa Transportista</Typography>
                        <Select name="empresa" value={formData.empresa} fullWidth>
                            <MenuItem value="Empresa A">Empresa A</MenuItem>
                            <MenuItem value="Empresa B">Empresa B</MenuItem>
                            <MenuItem value="Empresa C">Empresa C</MenuItem>
                            <MenuItem value="Empresa D">Empresa D</MenuItem>
                            <MenuItem value="Empresa E">Empresa E</MenuItem>
                            <MenuItem value="Empresa F">Empresa F</MenuItem>
                            <MenuItem value="Empresa G">Empresa G</MenuItem>
                            <MenuItem value="Empresa H">Empresa H</MenuItem>
                            <MenuItem value="Empresa I">Empresa I</MenuItem>
                            <MenuItem value="Empresa J">Empresa J</MenuItem>
                        </Select>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxWidth: "300px", width: "100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Tipo de vehículo a utilizar</Typography>
                        <Select name="type-vehicle" value={formData.tipo} fullWidth>
                            <MenuItem value="Camión Volvo">Camión Articulado</MenuItem>
                            <MenuItem value="Ford Ranger">Camión Rígido</MenuItem>
                            <MenuItem value="Chevrolet NKR 512">Furgón</MenuItem>
                            <MenuItem value="Toyota Hilux">Camioneta</MenuItem>
                            <MenuItem value="Chevrolet S10">Tractor con Semirremolque</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.patente}>
                        {editingVehicle ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>
        
        </Paper>
    )
}