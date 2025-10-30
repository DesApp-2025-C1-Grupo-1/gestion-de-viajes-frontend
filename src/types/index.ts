import { RemitoDto } from "../api/generated";

export type EstadoEntrega = "en camino" | "entregado" | "no_entregado";
export type PrioridadRemito = "baja" | "media" | "alta" | "urgente";

export interface GrupoRemitos {
  key: string;
  provincia: string;
  localidad: string;
  remitos: RemitoDto[];
  expanded: boolean;
}

export interface DraggableRemitosGridProps {
  remitos: RemitoDto[];
  remitoIds: number[];
  onToggleRemito: (remitoId: number) => void;
  onReorderRemitos: (nuevosIds: number[]) => void;
  remitosQuitados: RemitoDto[];
  restaurarRemito: (remito: RemitoDto) => void;
  quitarRemito: (remito: RemitoDto) => void;
  onToggleEntrega?: (remitoId: number, estado: EstadoEntrega) => void;
  onToggleEntregaMultiple?: (remitoIds: number[], estado: boolean) => void;
  entregas?: Record<number, EstadoEntrega>;
  disableDrag?: boolean;
  bulkUpdating?: number[];
}

export interface SortableRemitoRowProps {
  rem: RemitoDto;
  index: number;
  estadoEntrega?: EstadoEntrega;
  onToggleEntrega?: (id: number, estado: EstadoEntrega) => void;
  onQuitar?: (rem: RemitoDto) => void;
  canDrag?: boolean;
  isUpdating?: boolean;
  remitosIdsInGrupo?: number[];
}

export interface OrdenRemitosModalProps {
  open: boolean;
  onClose: () => void;
  estadoViaje: string;
  onUpdateEntrega: () => Promise<void>;
  remitos: RemitoDto[];
  remitoIds: number[];
  viajeId: string;
  onReorderRemitos: (newOrder: number[]) => void;
  onToggleRemito: (remitoId: number) => void;
  remitosQuitados: RemitoDto[];
  restaurarRemito: (remito: RemitoDto) => void;
  quitarRemito: (remito: RemitoDto) => void;
}

export interface UseRemitosManagementProps {
  control: any;
  setValue: any;
  initialRemitoIds?: number[];
  selectedProvincia?: any;
  selectedLocalidad?: any;
}