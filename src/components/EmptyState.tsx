import { Truck } from "lucide-react";
import ButtonAdd from "./buttons/ButtonAdd";

interface EmptyStateProps {
  onAdd: () => void;
}

export const EmptyState = ({ onAdd }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-64 text-center bg-muted/20 rounded-lg p-8">
    <div className="bg-muted/30 p-4 rounded-full mb-4">
      <Truck className="h-10 w-10 text-muted-foreground/60" />
    </div>
    <h3 className="text-lg font-medium mb-2">No hay tipos de vehículos</h3>
    <ButtonAdd title="Nuevo tipo" onClick={onAdd} />
  </div>
);