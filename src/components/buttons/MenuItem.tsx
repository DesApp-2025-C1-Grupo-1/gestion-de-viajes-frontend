import { Edit, Ellipsis, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItemProps{
    handleOpenDialog:() => void;
    id:string;
}

<<<<<<< HEAD
export default function MenuItem({handleOpenDialog,id}: MenuItemProps){
=======
export default function MenuItem({handleOpenDialog, id}: MenuItemProps){
>>>>>>> feature-driver
    const navigate = useNavigate();
    const location = useLocation();
    const [isActionOpen, setIsActionOpen] = useState(false);

    const handleActionClick = () => {
        setIsActionOpen(prev => !prev);
    };

    const pathPats = location.pathname.split("/");
    const module = pathPats[1];

    return(
        <div className="relative">
            <button 
<<<<<<< HEAD
                className=" flex items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors duration-200 " 
                onClick={handleActionClick}
            >
                <Ellipsis
                    className=" text-gray-500 hover:text-gray-700 size-4"
                />
=======
                className=" flex items-center justify-center p-2 rounded-md hover:bg-gray-200 transition-colors duration-200" 
                onClick={handleActionClick}
            >
                <Ellipsis className=" text-gray-500 hover:text-gray-700 size-4"/>
>>>>>>> feature-driver
            </button>
            <div className={`absolute right-0 top-9 z-10 py-2 bg-white shadow-md rounded-md border border-line ${isActionOpen ? "block" : "hidden"}`}>
                <p className="font-bold py-1 mb-1 text-xs text-center px-4">Acciones</p>
                <ul className="flex flex-col gap-2">
<<<<<<< HEAD
                    <li className="flex items-center  py-2 px-4 cursor-pointer hover:bg-gray-100 text-[#2563EB] text-xs" onClick={() => navigate(`/${module}/form/${id ?? ""}`)}>
=======
                    <li className="flex items-center  py-2 px-4 cursor-pointer hover:bg-gray-100 text-[#2563EB] text-xs" onClick={() => navigate(`/${module}/edit/${id ?? ""}`)}>
>>>>>>> feature-driver
                        <Edit className="size-4 mr-2" />
                        Editar
                    </li>
                    <li className="flex items-center  py-2 px-4 cursor-pointer hover:bg-gray-100 text-[#DC2626] text-xs" onClick={handleOpenDialog}>
                        <Trash2 className="size-4 mr-2" />
                        Eliminar
                    </li>
                </ul>
            </div>
        </div>
    )
}