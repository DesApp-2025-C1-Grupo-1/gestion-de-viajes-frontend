import ButtonAdd from "./buttons/ButtonAdd";

interface SectionHeaderProps {
  title: string;
  description: string;
  buttonText?: string;
  onAdd?: () => void;
}

export const SectionHeader = ({
  title,
  description,
  buttonText,
  onAdd
}: SectionHeaderProps) => {

  const renderButton = buttonText?.trim() !== "" && onAdd;

  return (
    <section className="ml-4 flex flex-col gap-0.5 sm:flex-row items-center justify-between pt-2 pb-3 sm:pb-5">
      <div className="flex flex-col items-start gap-1 md:gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="font-medium text-sm">{description}</p>
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