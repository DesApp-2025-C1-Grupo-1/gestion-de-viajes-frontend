import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { CompanyDriver, DriverType, VehicleDriver } from "../../types";
import { SelectChangeEvent } from "@mui/material";

interface FormDriverProps{
    onSubmit: (formData: Partial<DriverType>) => void;
    editingDriver?: DriverType | null;
    isEditing?: boolean;
    onCancel?: () => void; 
    companies?: CompanyDriver[]; //prueba
    vehicles?: VehicleDriver[]; //prueba
}

export const FormDriver = ({onSubmit, editingDriver, onCancel, isEditing, companies, vehicles} : FormDriverProps) => {
    const [formData, setFormData] = useState<Partial<DriverType>>({
        name:"",
        surname:"",
        dni:undefined,
        date_birth: null,
        company:undefined,
        vehicle:undefined
    });

    useEffect(() => {
        if(isEditing && editingDriver){
            setFormData(editingDriver)
        }
    }, [isEditing, editingDriver]);

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

    const handleDateChange = (newValue: dayjs.Dayjs | null) => {
        if (newValue) {
            setFormData((prev) => ({ ...prev, date_birth: newValue }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return(
        <Paper  sx={{padding:3, maxWidth: '95%', mx:'auto', borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}}>
            <form onSubmit={handleSubmit}>
                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 6 }}> 
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}> 
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre</Typography>
                        <TextField className="inside-paper" name="name" placeholder="Ingresar" value={formData.name} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Apellido</Typography>
                        <TextField className="inside-paper" name="surname" placeholder="Ingresar" value={formData.surname} onChange={handleChange} fullWidth />
                    </Box>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>DNI</Typography>
                        <TextField className="inside-paper" name="dni" placeholder="Ingresar" value={formData.dni} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Fecha de nacimiento</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker  
                                value={formData.date_birth ? dayjs(formData.date_birth) : null}
                                onChange={handleDateChange}
                                slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                slotProps={{textField: {className: "date-pciker", variant: "outlined"}}}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 5, mb: 6 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Empresa Transportista</Typography>
                        <Select name="empresa" value={formData.company} fullWidth>
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
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "25%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Vehículo a utilizar</Typography>
                        <Select name="vehiculo" value={formData.vehicle} fullWidth>
                            <MenuItem value="Camión Volvo">Camión Volvo</MenuItem>
                            <MenuItem value="Ford Ranger">Ford Ranger</MenuItem>
                            <MenuItem value="Chevrolet NKR 512">Chevrolet NKR 512</MenuItem>
                            <MenuItem value="Toyota Hilux">Toyota Hilux</MenuItem>
                            <MenuItem value="Chevrolet S10">Chevrolet S10</MenuItem>
                            <MenuItem value="Volkswagen Amarok">Volkswagen Amarok</MenuItem>
                            <MenuItem value="Nissan Frontier">Nissan Frontier</MenuItem>
                            <MenuItem value="Renault Alaskan">Renault Alaskan</MenuItem>
                            <MenuItem value="Mitsubishi L200">Mitsubishi L200</MenuItem>
                        </Select>
                    </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                    <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.name}>
                        {editingDriver ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>
        </Paper>
    )
}
