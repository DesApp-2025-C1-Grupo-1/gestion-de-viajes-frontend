export type Zona = {
  id: number;
  nombre: string;
  descripcion: string;
  regionMapa: string;
  activo: boolean;
  provincias?: { id: number; nombre: string }[];
}

export type Tarifa = {
  id: number;
  nombre: string;
  valorBase: number;
  esVigente: boolean;
  transportistaNombre: string;
  tipoVehiculoNombre: string;
  zonaNombre: string;
  tipoCargaNombre: string;
  transportistaId: string;
  tipoVehiculoId: string;
  zonaId: number;
  tipoCargaId: number;
  total: number;
  adicionales: {
    id: number;
    adicional: {
      id: number;
      nombre: string;
      costoDefault: number;
      descripcion: string;
      activo: boolean;
      esGlobal: boolean;
    };
    costoEspecifico: number;
    activo: boolean;
  }[];
}

const URL_ZONAS = 'https://tarifas-de-costos-acme-backend.onrender.com/api/zonas';


export const tarifas: Tarifa[] = [
  {
    "id": 1,
    "nombre": "Tarifa 2",
    "valorBase": 30000,
    "esVigente": true,
    "transportistaNombre": "Oca",
    "tipoVehiculoNombre": "Camion",
    "zonaNombre": "Ituzaingo",
    "tipoCargaNombre": "Madera",
    "transportistaId": "683f7e044904b1a84fc05249",
    "tipoVehiculoId": "683f7d734904b1a84fc0523b",
    "zonaId": 46,
    "tipoCargaId": 1,
    "total": 34000,
    "adicionales": [
      {
        "id": 1,
        "adicional": {
          "id": 1,
          "nombre": "Estadia",
          "costoDefault": 4000,
          "descripcion": "2 noches",
          "activo": true,
          "esGlobal": false
        },
        "costoEspecifico": 4000,
        "activo": true
      }
    ]
  }
]

export const getTarifasFiltradas = (
  empresaId: string,
  vehiculoId: string,
  zonaId: number
) => {
  return tarifas.filter(tarifa => 
    tarifa.transportistaId === empresaId &&
    tarifa.tipoVehiculoId === vehiculoId &&
    tarifa.zonaId === zonaId &&
    tarifa.esVigente
  );
};