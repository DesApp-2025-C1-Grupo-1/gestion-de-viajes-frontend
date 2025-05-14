import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Grid, Container} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { CompanyType, DriverType, Vehicle} from "../../types";
import { companies, vehicles } from "../../lib/mock-data";

interface FormDriverProps{
    onSubmit: (formData: Partial<DriverType>) => void;
    editingDriver?: DriverType | null;
    isEditing?: boolean;
    onCancel?: () => void;  
    companies?: CompanyType[]
    vehicles?: Vehicle[]
}

export const FormDriver = ({onSubmit, editingDriver, onCancel, isEditing} : FormDriverProps) => {
    const [formData, setFormData] = useState<Partial<DriverType>>({
        _id: "", 
        name: "",
        surname: "",
        dni: 0,
        date_birth: dayjs(),
        company: "",
        vehicle: "",
        licence: 0,
        typeLicence: "",
        telephone: 0,
        email:"",
    });


    useEffect(() => {
        if(editingDriver){
            setFormData({
                _id: editingDriver._id,
                surname: editingDriver.surname,
                dni: editingDriver.dni,
                date_birth: dayjs(editingDriver.date_birth),
                company: editingDriver.company,
                vehicle: editingDriver.vehicle,
                typeLicence: editingDriver.typeLicence,
                telephone: editingDriver.telephone,
                email: editingDriver.email,
            })
        }
        else{
            setFormData({
               _id: "", 
                name: "",
                surname: "",
                dni: 0,
                date_birth: dayjs(),
                company: "",
                vehicle: "",
                licence: 0,
                typeLicence: "",
                telephone: 0,
                email:"",  
            });
        }
    }, [editingDriver]);

    /*
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
    };*/

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        //const{name, value} = e.target
        //setFormData(prev => ({...prev, [name]: value}))
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return(
        <Paper  sx={{maxHeight:"90%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}}>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Datos personales</Typography>
                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre</Typography>
                        <TextField className="inside-paper" name="name" placeholder="Ingresar" value={formData.name} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Apellido</Typography>
                        <TextField className="inside-paper" name="surname" placeholder="Ingresar" value={formData.surname} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>DNI</Typography>
                        <TextField className="inside-paper" name="dni" placeholder="Ingresar" value={formData.dni} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha de nacimiento</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker  
                                value={formData.date_birth ? dayjs(formData.date_birth) : null}
                                onChange={(date) => setFormData(prev => ({...prev, date_birth: date}))}
                                slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                slotProps={{textField: {className: "date-pciker", variant: "outlined"}}}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Empresa Transportista</Typography>
                        <Select name="company" value={formData.company} onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))} fullWidth>
                            {companies.map((empresa) => (
                                <MenuItem key={empresa._id} value={empresa.nombre_comercial}>{empresa.nombre_comercial}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Vehículo a utilizar</Typography>
                        <Select name="vehicle" value={formData.vehicle} onChange={(e) => setFormData(prev => ({...prev, vehicle: e.target.value}))} fullWidth>
                            {vehicles.map((vehiculo) => (
                                <MenuItem key={vehiculo._id} value={vehiculo.marca}>{vehiculo.marca}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>

                <Box sx={{display:"flex", justifyContent:"flex-end", gap:2}}>
                    <Button onClick={onCancel} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.name}>
                        {editingDriver ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>      
        </Paper>

    )

{/*
                <Box sx={{display:"flex", flexFlow:"wrap", gap:5, mb:6}}>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Nombre</Typography>
                        <TextField className="inside-paper" name="name" placeholder="Ingresar" value={formData.name} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Apellido</Typography>
                        <TextField className="inside-paper" name="surname" placeholder="Ingresar" value={formData.surname} onChange={handleChange} fullWidth />
                    </Box>
                </Box>

                <Box sx={{display:"flex", flexFlow:"wrap", gap:5, mb:6}}>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>DNI</Typography>
                        <TextField className="inside-paper" name="dni" placeholder="Ingresar" value={formData.dni} onChange={handleChange} fullWidth />
                    </Box>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Fecha de nacimiento</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker  
                                value={formData.date_birth ? dayjs(formData.date_birth) : null}
                                onChange={(date) => setFormData(prev => ({...prev, date_birth: date}))}
                                slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                slotProps={{textField: {className: "date-pciker", variant: "outlined"}}}
                            />
                        </LocalizationProvider>
                    </Box>
                </Box>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:4}}>Asignar recursos</Typography>

                <Box sx={{display:"flex", flexFlow:"wrap", gap:5, mb:6}}>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Empresa Transportista</Typography>
                        <Select name="company" value={formData.company} onChange={(e) => setFormData(prev => ({...prev, company: e.target.value}))} fullWidth>
                            {companies.map((empresa) => (
                                <MenuItem key={empresa._id} value={empresa.nombre_comercial}>{empresa.nombre_comercial}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <Box sx={{display:"flex", flexDirection:"column", gap:1, maxWidth:"300px", width:"100%"}}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem'}}>Vehículo a utilizar</Typography>
                        <Select name="vehicle" value={formData.vehicle} onChange={(e) => setFormData(prev => ({...prev, vehicle: e.target.value}))} fullWidth>
                            {vehicles.map((vehiculo) => (
                                <MenuItem key={vehiculo._id} value={vehiculo.marca}>{vehiculo.marca}</MenuItem>
                            ))}
                        </Select> 
                    </Box>
                </Box>*/}


      
}
