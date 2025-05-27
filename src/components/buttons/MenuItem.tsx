import { Popover, Typography, ListItemButton, ListItemIcon, ListItemText, List } from "@mui/material";
import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItemProps{
    handleOpenDialog:() => void;
    id:string;
    children?: React.ReactNode;
    handleOpenDetails?: () => void;
}

export default function MenuItem({handleOpenDialog, id, children, handleOpenDetails}: MenuItemProps){
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const pathParts = location.pathname.split("/");
    const module = pathParts[1];
    

    return(
        <div className="relative h-full flex items-center justify-center">
            <button 
                className=" flex items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors duration-200" 
                onClick={handleClick}
            >
                <Ellipsis className=" text-gray-500 hover:text-gray-700 size-4"/>
            </button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{
                    paper: {
                        elevation: 2,
                        style: {
                            borderRadius: 8,
                            minWidth: 100,
                            paddingTop: 8,
                            paddingBottom: 8,
                            border: '1px solid #E5E7EB'
                        }
                    }
                }}
            >
                <Typography variant="subtitle2" align="center" sx={{ px: 2, pb: 1, fontWeight: "bold", fontSize: 12 }}>
                Acciones
                </Typography>
                <List dense disablePadding>
                    <ListItemButton
                        onClick={() => {
                        navigate(`/${module}/edit/${id ?? ""}`);
                        handleClose();
                        }}
                        sx={{ gap: 1, px: 2 }}
                    >
                        <ListItemIcon sx={{ minWidth: 20 }}>
                            <Edit size={16} color="#2563EB" />
                        </ListItemIcon>
                        <ListItemText primary="Editar" primaryTypographyProps={{ fontSize: 13, color: "#2563EB" }} />
                    </ListItemButton>

                    <ListItemButton
                        onClick={() => {
                        handleOpenDialog();
                        handleClose();
                        }}
                        sx={{ gap: 1, px: 2 }}
                    >
                        <ListItemIcon sx={{ minWidth: 20 }}>
                            <Trash2 size={16} color="#DC2626" />
                        </ListItemIcon>
                        <ListItemText primary="Eliminar" primaryTypographyProps={{ fontSize: 13, color: "#DC2626" }} />
                    </ListItemButton>

                    {children && handleOpenDetails &&(
                        <ListItemButton
                            onClick={() => {
                                handleOpenDetails();
                                handleClose();
                            }}
                            sx={{ gap: 1, px: 2 }}
                        >
                            <ListItemIcon sx={{ minWidth: 20 }}>
                                {children}
                            </ListItemIcon>
                            <ListItemText primary="Detalles" primaryTypographyProps={{ fontSize: 13, color: "#4B5563" }} />
                        </ListItemButton>
                    )}
                </List>
            </Popover>
        </div>
    )
}