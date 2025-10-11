import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

interface OptionMenuProps {
  isCollapsed: boolean;
  onClick: () => void;
  title: string;
  link?: string;
  IconComponent: React.FC<{color?: string}>;
  commonClasses?: string;
  isSubmenu?: boolean;
}

export default function OptionMenu({ isCollapsed,onClick, IconComponent, title, link, commonClasses, isSubmenu = false }: OptionMenuProps) {
  const location = useLocation();
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isActive, setIsActive] = useState(false);

  const isExternal = link &&link.startsWith("http");

  // Verificar si la ruta actual comienza con el link asignado
  useEffect(() => {
    const currentPath = location.pathname;
    const targetPath = `/${link}`;

    // Si es la home exacta
    if (link === "" && currentPath === "/") {
      setIsActive(true);
    } else if (link && currentPath.includes(link)) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }


  }, [location, link]);


  const commonSubmenuClasses = `
    flex items-center h-14 rounded-lg overflow-hidden
    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
    w-full px-4
    ${isActive 
      ? "bg-menu-hover text-primary-orange"
      : "hover:bg-menu-hover text-gray-600"}
    ${isSubmenu && !isCollapsed ? "pl-10 " : ""}
  `;

  const content = (
    <div className={`flex items-center ${!isCollapsed && "gap-4"} w-full`}>
      <IconComponent color={isActive ? "#E65F2B" : "#5A5A65"} />
      <p
        ref={textRef}
        className={`
          text-sm whitespace-nowrap
          transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${isCollapsed ? "opacity-0 translate-x-[-10px] w-0" : "opacity-100 translate-x-0 w-auto"}
        `}
      >
        {title}
      </p>
    </div>
  );

  return isExternal ? (
    <a
      href={link}
      target="_self"
      rel="noopener noreferrer"
      onClick={() => { onClick(); }}
      className={`${commonClasses? commonClasses : commonSubmenuClasses} sidebar-item`}
    >
      {content}
    </a>
  ) : (
    <Link to={`/${link}`} onClick={onClick} className={`${commonClasses? commonClasses : commonSubmenuClasses} sidebar-item`}>
      {content}
    </Link>
  );
}