import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography, Grid, Container, SelectChangeEvent} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { Company } from "../../types";

interface FormCompanyProps{
    onSubmit: (formData: Partial<Company>) => void;
    editingCompany?: Company | null;
    isEditing?: boolean;
    onCancel?: () => void;
}

export const FormCompany =({onSubmit, editingCompany, onCancel, isEditing}: FormCompanyProps) => {
    //const {id} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Partial<Company>>({
        _id: "",
        razon_social: "",
        nombre_comercial: "",
        cuit: undefined,
        domicilio_fiscal: "",
        telefono: undefined,
        mail: "",
        nombre_contacto: ""
    });

    useEffect(() => {
            if(editingCompany){
                setFormData({
                    _id: editingCompany._id,
                    razon_social: editingCompany.razon_social,
                    nombre_comercial: editingCompany.nombre_comercial,
                    cuit: editingCompany.cuit,
                    domicilio_fiscal: editingCompany.domicilio_fiscal,
                    telefono: editingCompany.telefono,
                    mail: editingCompany.mail,
                    nombre_contacto: editingCompany.nombre_contacto,
                })
            }
        }, [editingCompany]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData)
    };

    return(
        <Paper  sx={{maxHeight:"85%", padding:3, overflow:"auto", mx:'auto', width:"100%", borderRadius: 2, boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", border: "0.5px solid #C7C7C7"}}>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>Datos de la Empresa</Typography>
                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Razon social</Typography>
                        <TextField className="inside-paper" name="razon_social" placeholder="Ingresar" value={formData.razon_social} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre comercial</Typography>
                        <TextField className="inside-paper" name="nombre_comercial" placeholder="Ingresar" value={formData.nombre_comercial} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>CUIT/RUT</Typography>
                        <TextField className="inside-paper" name="cuit" placeholder="Ingresar" value={formData.cuit} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Domicilio fiscal</Typography>
                        <TextField className="inside-paper" name="domicilio_fiscal" placeholder="Ingresar" value={formData.domicilio_fiscal} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>

                <Typography sx={{color: "#5A5A65" , fontWeight: 550 , fontSize: "1.2rem", mb:2}}>Datos de contacto</Typography>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Nombre de contacto</Typography>
                        <TextField className="inside-paper" type="tel" name="nombre_contacto" placeholder="Ingresar" value={formData.nombre_contacto} onChange={handleChange} fullWidth />        
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Telefono</Typography>
                        <TextField className="inside-paper" name="telefono" placeholder="Ingresar" value={formData.telefono} onChange={handleChange} fullWidth />        
                    </Grid>
                </Grid>

                <Grid container spacing={5} mb={3}>
                    <Grid item xs={12} sm={6} md={6} lg={4} xl={3}>
                        <Typography sx={{ color: "#5A5A65", fontSize: '0.900rem', mb:1}}>Email</Typography>
                        <TextField className="inside-paper" name="mail" placeholder="Ingresar" value={formData.mail} onChange={handleChange} fullWidth />
                    </Grid>
                </Grid>


                <Box sx={{display:"flex", justifyContent:"flex-end", gap:2}}>
                    <Button onClick={() => navigate("/drivers")} variant="outlined">Cancelar</Button>
                    <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.nombre_comercial}>
                        {editingCompany ? "Actualizar" : "Crear"}
                    </Button>
                </Box>
            </form>      
        </Paper>    
    )
}