import {useEffect, useState} from "react";

export function useAutoRowsPerPage() {
    const [rowsPerPage, setRowsPerPage] = useState<number>(5);
    
    // Este efecto se encarga de calcular el número de filas que caben en la pantalla
    // y actualizar el estado de rowsPerPage. Se ejecuta cada vez que se redimensiona la ventana.
    useEffect(() => {
        const handleResize = () => {
            const paginationHeight = 64;
            const sectionHeaderHeight = 88 + 40;
            const sectionHeaderHeightMobile = 138.5 + 84.5;
            const sectionHeaderHeightTablet = 88 + 40;
            const isMobile = window.innerWidth < 640; // sm breakpoint de tailwind
            const isTablet = window.innerWidth < 1024; // md breakpoint de tailwind
            const isDesktop = window.innerWidth >= 1024; // lg breakpoint de tailwind
            const rowHeight = isDesktop? 72 : 93;
            const margin = 90; // de margen

            // Si es mobile, el header ocupa más espacio
            // Si es tablet, el header ocupa menos espacio
            // Si es desktop, el header ocupa lo normal
            const headerHeight = isMobile ? sectionHeaderHeightMobile 
                : isTablet ? sectionHeaderHeightTablet 
                : sectionHeaderHeight; 
            
            // La altura disponible es la altura de la ventana menos la altura del header y la paginación
            const availableHeight = window.innerHeight - headerHeight - paginationHeight - margin; 

            // Calculamos el número de filas que caben en la pantalla
            const estimated = Math.floor(availableHeight / rowHeight);
            setRowsPerPage(Math.max(1, estimated));
        };

        handleResize(); // inicializarlo
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return { rowsPerPage, setRowsPerPage };
}

