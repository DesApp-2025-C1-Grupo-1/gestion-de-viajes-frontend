import { useNavigate, useParams } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import React, { useEffect, useState } from "react";
import { Box, Button, Paper, TextField, Select, MenuItem, Typography} from "@mui/material";
import { CompanyDriver, Vehicle, VehicleDriver } from "../../types";
import { fetchVehicleById, createVehicle, updateVehicle } from "../../lib/api";
import { SelectChangeEvent } from "@mui/material/Select";

export default function CreateVehicle() {
    const {id} = useParams();
    const navigate = useNavigate();
    const isEditing = !!(id);
    const [loading, setLoading] = useState(isEditing);
    const [formData, setFormData] = useState<Partial<Vehicle>>({
        _id: "",
        patente: "",
        modelo: "",
        marca: "",
        tipo: "",
        empresa: "",
        año: new Date().getFullYear(),
        peso_carga: 0,
        volumen_carga: 0,
    });

    useEffect(() => {
        if(isEditing && id){
            fetchVehicleById(id!)
                .then((vehicle: Vehicle) => setFormData(vehicle))
        }
    }, [id]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await updateVehicle(id!, formData as Omit<Vehicle, "_id">);
            } else {
                await createVehicle(formData as Omit<Vehicle, "_id">);
            }
            navigate("/vehicles");
        } catch (err) {
            alert("Error al guardar vehículo");
        }
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    return (
        <>
            <SectionHeader 
                title={isEditing ? "Editar vehículo" : "Crear vehículo"}
                description={isEditing ? "Modifica los datos del vehículo" : "Aquí puedes registrar un nuevo vehículo."}
                buttonText="Volver a vehículos"
                onAdd={() => navigate("/vehicles")}
            />

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
                            <Select 
                                name="empresa" 
                                value={formData.empresa}
                                fullWidth
                                onChange={handleSelectChange}
                                displayEmpty
                            >
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
                            <Select 
                                name="tipo" 
                                value={formData.tipo} 
                                fullWidth
                                onChange={handleSelectChange}
                                displayEmpty
                            >
                                <MenuItem value="Camión Articulado">Camión Articulado</MenuItem>
                                <MenuItem value="Camión Rígido">Camión Rígido</MenuItem>
                                <MenuItem value="Furgón">Furgón</MenuItem>
                                <MenuItem value="Camioneta">Camioneta</MenuItem>
                                <MenuItem value="Tractor con Semirremolque">Tractor con Semirremolque</MenuItem>
                            </Select>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                        <Button onClick={() => navigate("/vehicles")} variant="outlined">Cancelar</Button>
                        <Button type="submit" variant="contained" sx={{ backgroundColor: "#E65F2B" }} disabled={!formData.patente}>
                            {isEditing ? "Actualizar" : "Crear"}
                        </Button>
                    </Box>
                </form>
            
            </Paper>

        </>
    )
}