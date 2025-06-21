import { Menu } from "lucide-react";
import ButtonAdd from "./buttons/ButtonAdd";
import { useOutletContext } from "react-router-dom";

interface SectionHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onAdd?: () => void;
}

interface OutletContext {
  toggleSidebar: () => void;
}

export const SectionHeader = ({
  title,
  description,
  buttonText,
  onAdd
}: SectionHeaderProps) => {
  const { toggleSidebar } = useOutletContext<OutletContext>();
  const renderButton = buttonText?.trim() !== "" && onAdd;

  return (
    <section className="flex flex-col gap-4 sm:flex-row items-center justify-between md:pt-2 pb-3 sm:pb-5">
       
      <div className="flex items-center gap-2 w-full">
        {/* Botón hamburguesa solo en mobile */}
        <button
          onClick={toggleSidebar}
          className="text-gray-600 border border-gray-400 bg-[#F6F7FB] rounded-md p-1  md:hidden"
        >
          <Menu className="size-6" />
        </button>
        <div className="flex flex-col items-start gap-1 md:gap-2 w-full md:ml-2"> 
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="font-medium text-sm">{description}</p>
        </div>
      </div>
      {renderButton &&
        <ButtonAdd
          title={buttonText as string}
          onClick={onAdd}
          aria-label={`Añadir nuevo ${title.toLowerCase()}`}
        />
      }
      
    </section>
  );
};