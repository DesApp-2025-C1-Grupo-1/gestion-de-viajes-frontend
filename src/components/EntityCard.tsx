import { Button, Card, Typography } from "@mui/material";
import { Edit, Eye, Trash2 } from "lucide-react";
import { ReactNode } from "react";

type Field = {
  label: string;
  value: ReactNode;
};

type Action = {
  label: string;
  color?: string; // color opcional para el botón
  onClick: () => void;
  icon?: ReactNode;
};

type EntityCardProps = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  fields: Field[];
  headerAction?: Action; // como el botón "Agenda"
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function EntityCard({ title, subtitle, icon, fields, onView, onEdit, onDelete ,headerAction}: EntityCardProps) {



    return (
        <Card className="w-full border border-line rounded-lg overflow-hidden">
            <header className="p-5 bg-gray-100 flex justify-between items-center gap-4 border-b border-line w-full h-24">
                <div className="flex gap-4 items-center w-max">
                    <div className="p-3 rounded-full shadow-sm bg-primary-orange text-white h-max w-max ">
                        {icon}
                    </div>
                    <div className="flex flex-col justify-center w-full">
                        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.10rem' }} className="text-gray-800 line-clamp-1">
                            {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </div>
                </div>
                {headerAction && (
                    <Button
                        variant="outlined"
                        onClick={headerAction.onClick}
                        startIcon={headerAction.icon}
                        sx={{ textTransform: 'none', px: 2, borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, color: headerAction.color || 'text.primary', borderColor: headerAction.color || '#B9B9B9', backgroundColor: "white", "&:hover": { borderColor: headerAction.color || 'grey.700', backgroundColor: "white" } }}
                    >
                        {headerAction.label}
                    </Button>
                )}
            </header>
            <article className="p-5 grid gap-4 sm:grid-cols-2 items-start">
                {fields.map((field, index) => (
                    <div key={index} className="flex flex-col gap-1 justify-between">
                        <Typography variant="body2" color="text.secondary">
                            {field.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={600} sx={{ fontSize: '0.90rem'}}>
                            {field.value}
                        </Typography>
                    </div>
                ))}
            </article>
            <footer className="p-5 flex justify-between items-center">
                <Button
                    variant="outlined"
                    onClick={onView}
                    sx={{ textTransform: 'none', color: 'text.primary',backgroundColor:"grey.100" , borderColor: 'grey.200', fontWeight: 600, "&:hover": { borderColor: 'grey.700', backgroundColor:"grey.100"} }}
                    startIcon={<Eye size={16} />}
                >
                    Detalles
                </Button>
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