import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Grid, Container, SelectChangeEvent} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Company, Driver, Vehicle} from "../../types";
import { companies, vehicles } from "../../lib/mock-data";
import { useNavigate } from "react-router-dom";

interface FormDriverProps{
    onSubmit: (formData: Partial<Driver>) => void;
    editingDriver?: Driver | null;
    isEditing?: boolean;
    onCancel?: () => void;  
    companies?: Company[]
    vehicles?: Vehicle[]
}

export const FormDriver = ({onSubmit, editingDriver, onCancel, isEditing} : FormDriverProps) => {
    //const {id} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Driver>>({
        _id: "", 
        nombre: "",
        apellido: "",
        dni: undefined,
        fecha_nacimiento: null,
        empresa: "",
        vehiculo: "",
        licencia: undefined,
        tipo_licencia: "",
        telefono: undefined,
        email:"",
    });

    useEffect(() => {
        if(editingDriver){
            setFormData({
                _id: editingDriver._id,
                nombre: editingDriver.nombre,
                apellido: editingDriver.apellido,
                dni: editingDriver.dni,
                fecha_nacimiento: dayjs(editingDriver.fecha_nacimiento),
                empresa: editingDriver.empresa,
                vehiculo: editingDriver.vehiculo,
                tipo_licencia: editingDriver.tipo_licencia,
                telefono: editingDriver.telefono,
                email: editingDriver.email,
                licencia: editingDriver.licencia,
            })
        }
    }, [editingDriver]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setFormData({...formData, [e.target.name]: e.target.name === "date_birth" 
            ? e.target.value ? dayjs(e.target.value) : null 
            : e.target.value,});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return(
        <Paper  sx={{maxHeight:"85%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}}>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>Datos personales</Typography>
                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre</Typography>
                        <TextField className="inside-paper" name="nombre" placeholder="Ingresar" value={formData.nombre} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Apellido</Typography>
                        <TextField className="inside-paper" name="apellido" placeholder="Ingresar" value={formData.apellido} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>DNI</Typography>
                        <TextField className="inside-paper" name="dni" placeholder="Ingresar" value={formData.dni} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Fecha de nacimiento</Typography>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker  
                                value={formData.fecha_nacimiento ? dayjs(formData.fecha_nacimiento) : null}
                                onChange={(date) => setFormData(prev => ({...prev, fecha_nacimiento: date}))}
                                slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
                                slotProps={{textField: {className: "date-pciker", variant: "outlined", 
                                    sx: {"& .MuiInputBase-root": {height:48},}}}}
                            />
                        </LocalizationProvider>
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Tipo de licencia</Typography>
                        <TextField className="inside-paper" name="tipo_licencia" placeholder="Ingresar" value={formData.tipo_licencia} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Licencia</Typography>
                        <TextField className="inside-paper" type="number"  name="licencia" placeholder="Ingresar" value={formData.licencia} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Teléfono</Typography>
                        <TextField className="inside-paper" type="tel" name="telefono" placeholder="Ingresar" value={formData.telefono} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Email</Typography>
                        <TextField className="inside-paper" type="email" name="email" placeholder="Ingresar" value={formData.email} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>Asignar recursos</Typography>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Empresa Transportista</Typography>
                        <Select name="empresa" value={formData.empresa} onChange={handleSelectChange} fullWidth>
                            {companies.map((empresa) => (
                                <MenuItem key={empresa._id} value={empresa.nombre_comercial}>{empresa.nombre_comercial}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Vehículo a utilizar</Typography>
                        <Select name="vehiculo" value={formData.vehiculo} onChange={handleSelectChange} fullWidth>
                            {vehicles.map((vehiculo) => (
                                <MenuItem key={vehiculo._id} value={vehiculo.marca}>{vehiculo.marca}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>

                <Box sx={{display:"flex", justifyContent:"flex-end", gap:2}}>
                    <Button onClick={() => navigate("/drivers")} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.nombre}>
                        {editingDriver ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>      
        </Paper>
    )  
}
