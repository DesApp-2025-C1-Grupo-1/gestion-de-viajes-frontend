import { Box, Button, Card, Grid, Tooltip, Typography } from "@mui/material";
import { Edit, Eye, Trash2 } from "lucide-react";
import { ReactNode } from "react";
import { TripDistributionType } from "./tripsDistribution/TripDistributionType";
import LicenseValidate from "./vehicle/type-vehicle/LicenseValidate";

type Field = {
    label: string;
    value: ReactNode;
    isLong?: boolean;
    extend?: boolean;
};

type EntityCardProps = {
    icon: ReactNode;
    title: string;
    subtitle?: ReactNode;
    fields: Field[];
    headerEstado?: string; // para el estado
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    licenseType?: string;
};

export default function EntityCard({ title, subtitle, icon, fields, onView, onEdit, onDelete ,headerEstado, licenseType}: EntityCardProps) {
    return (
        <Card className="w-full border border-line rounded-lg overflow-hidden">
            <header className="p-5 bg-gray-100 w-full h-24 flex justify-between items-center border-b border-line">
                <div className="flex justify-center gap-4 items-center w-max">
                    <div className="p-3 rounded-full shadow-sm bg-primary-orange text-white h-max w-max flex items-center justify-center">
                        {icon}
                    </div>
                    <div className="flex flex-col justify-center w-full gap-y-1">
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.10rem' }} className="text-gray-600">
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography sx={{ fontSize: '0.815rem', color: 'text.secondary' }}>
                                {subtitle}
                            </Typography>
                        )}
                    </div>
                </div>
                {headerEstado && (
                    <Box sx={{ display: 'flex', gap: 1 , alignItems: 'center', flexDirection: 'column'}}>
                        <TripDistributionType tipo={headerEstado} />
                    </Box>
                )}
                {licenseType && (
                    <Box sx={{ display: 'flex', gap: 1 , alignItems: 'center', flexDirection: 'column'}}>
                        <LicenseValidate licenseType={licenseType} />
                    </Box>
                )}
            </header>
            <article>
                <Grid container spacing={2} className="p-5 pb-0">
                    {fields.map((field, index) => (
                        <Grid item xs={field.extend ? 12 : 6} key={index}>
                            <Typography variant="body2" color="text.secondary">
                                {field.label}
                            </Typography>
                            {!field.isLong ? (
                                <Typography
                                    variant="h6" 
                                    fontWeight={600} 
                                    sx={{ fontSize: '0.90rem', textOverflow: licenseType ? '' : 'ellipsis', overflow: 'hidden', whiteSpace: licenseType ? '' : 'nowrap' }}
                                >
                                    {field.value}
                                </Typography>
                            ) : (
                                <Tooltip 
                                    title={field.value} 
                                    placement="bottom-start"
                                    slotProps={{
                                        popper: {
                                        modifiers: [
                                            {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -14],
                                            },
                                        },],},
                                    }}
                                >
                                    <Typography
                                        variant="h6" 
                                        fontWeight={600} 
                                        sx={{ fontSize: '0.90rem'}}
                                        className="truncate"
                                    >
                                        {field.value}
                                    </Typography>
                                </Tooltip>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </article>
            <footer className="p-5 flex justify-between items-center">

                {onView ? (
                   <Button
                        variant="outlined"
                        onClick={onView}
                        sx={{ textTransform: 'none', color: 'text.primary',backgroundColor:"grey.100" , borderColor: 'grey.200', fontWeight: 600, "&:hover": { borderColor: 'grey.700', backgroundColor:"grey.100"} }}
                        startIcon={<Eye size={16} />}
                    >
                        Detalles
                    </Button> 
                ) : (<div /> 
                )}
                
                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        onClick={onEdit}
                        sx={{ textTransform: 'none', color: '#214BD3', borderColor: '#AFD1FF', backgroundColor: '#DBEAFE', fontWeight: 600, "&:hover": { borderColor: '#214BD3', backgroundColor: '#D0E3FF' } }}
                        startIcon={<Edit size={16} color="#214BD3" />}
                    >
                        Editar
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onDelete}
                        sx={{ textTransform: 'none', color: '#FF3535', borderColor: '#FF9292', backgroundColor: 'rgba(255, 53, 53, 0.25)', fontWeight: 600, "&:hover": {  borderColor: '#FF3535', backgroundColor: 'rgba(255, 53, 53, 0.35)' } }}
                        startIcon={<Trash2 size={16} color="#FF3535"/>}
                    >
                        Eliminar
                    </Button>
                </div>
            </footer>
        </Card>
    );
}