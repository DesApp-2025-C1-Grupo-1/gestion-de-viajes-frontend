import ButtonAdd from "./buttons/ButtonAdd";

interface SectionHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onAdd: () => void;
}

export const SectionHeader = ({
  title,
  description,
  buttonText,
  onAdd
}: SectionHeaderProps) => {
  return (
    <section className="flex flex-col gap-4 md:flex-row items-center justify-between pt-2 pb-3 md:pb-5">
      <div className="flex flex-col items-start gap-1 md:gap-2">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="font-medium text-sm">{description}</p>
      </div>
      <ButtonAdd
        title={buttonText}
        onClick={onAdd}
        aria-label={`Añadir nuevo ${title.toLowerCase()}`}
      />
    </section>
  );
};