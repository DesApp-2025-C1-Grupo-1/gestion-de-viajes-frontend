import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

interface OptionMenuProps {
  isCollapsed: boolean;
  //src: string;
  title: string;
  link?: string;
  IconComponent: React.FC<{color?: string}>;
}

export default function OptionMenu({ isCollapsed, IconComponent, title, link = "" }: OptionMenuProps) {
  const location = useLocation();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  // Calcular ancho del texto para la animación
  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, []);

  // Verificar si la ruta actual comienza con el link asignado
  useEffect(() => {
    const currentPath = location.pathname;
    const targetPath = `/${link}`;

    // Si es la home exacta
    if (link === "" && currentPath === "/") {
      setIsActive(true);
    } else if (link !== "" && currentPath.startsWith(targetPath)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [location, link]);

  return (
      <Link 
        to={`/${link}`}
        className={`
          flex items-center h-14 rounded-lg overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          w-full px-4
          ${isActive 
            ? 'bg-menu-hover text-primary-orange' 
            : 'hover:bg-menu-hover text-gray-600'
          }
        `}
      >
      <div className={`flex items-center  ${!isCollapsed && "gap-4 "} w-full`}>
        <IconComponent color={isActive ? " #E65F2B" : "#5A5A65" } />
        <p 
          ref={textRef}
          className={`
            text-sm  whitespace-nowrap
            transition-all duration-300
            ${isCollapsed ? 'opacity-0 translate-x-[-10px] w-0' : 'opacity-100 translate-x-0'}
          `}
          style={{ width: isCollapsed ? 0 : textWidth }}
        >
          {title}
        </p>
      </div>
    </Link>
  );
}