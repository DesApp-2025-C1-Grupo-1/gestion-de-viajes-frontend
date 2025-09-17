import { create, update } from "lodash";
import { toast } from "sonner";

type NotifyType = "create" | "update" | "delete" | "error" | "custom";
type NotifyGender = "female" | "male";

const verb = {
  create: {female: "creada", male: "creado"},
  update: {female: "actualizada", male: "actualizado"},
  delete: {female: "eliminada", male: "eliminado"},
}

export function useNotify(entityName: string = "Elemento", typeGender: NotifyGender = "male") {
  const notify = (type: NotifyType, message?: string) => {
    switch (type) {
      case "create":
        toast.success(`${entityName} ${verb.create[typeGender]} correctamente.`);
        break;
      case "update":
        toast.success(`${entityName} ${verb.update[typeGender]} correctamente.`);
        break;
      case "delete":
        toast.success(`${entityName} ${verb.delete[typeGender]} correctamente.`);
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
