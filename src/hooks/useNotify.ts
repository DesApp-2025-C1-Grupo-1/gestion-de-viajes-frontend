import { toast } from "sonner";

type NotifyType = "create" | "update" | "delete" | "error" | "custom";

export function useNotify(entityName: string = "Elemento") {
  const notify = (type: NotifyType, message?: string) => {
    switch (type) {
      case "create":
        toast.success(`${entityName} creado correctamente.`);
        break;
      case "update":
        toast.success(`${entityName} actualizado correctamente.`);
        break;
      case "delete":
        toast.success(`${entityName} eliminado correctamente.`);
        break;
      case "error":
        toast.error(message || `Ocurrió un error con ${entityName.toLowerCase()}.`);
        break;
      case "custom":
        toast(message || "");
        break;
      default:
        toast(message || "");
    }
  };

  return { notify };
}