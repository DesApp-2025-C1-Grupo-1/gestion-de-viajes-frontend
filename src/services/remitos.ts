export type Remito = {
	id: number;
	numeroAsignado: string;
	fechaEmision: string;
	observaciones: string;
	archivoAdjunto: string | null;
	razonNoEntrega: string | null;
	prioridad: string;
	activo: boolean;
	clienteId: number;
	destinoId: number;
	estadoId: number;
	estadoAnteriorId: number | null;
	mercaderiaId: number;
	createdAt: string;
	updatedAt: string;
	destino: {
		id: number;
		nombre: string;
		pais: string;
		provincia: string;
		localidad: string;
		direccion: string;
		activo: boolean;
		createdAt: string;
		updatedAt: string;
	};
	cliente: {
		id: number;
		razonSocial: string;
		cuit_rut: string;
		direccion: string;
		tipoEmpresaId: number;
		activo: boolean;
		createdAt: string;
		updatedAt: string;
	};
	estado: {
		id: number;
		nombre: string;
		createdAt: string;
		updatedAt: string;
	};
	mercaderia: {
		id: number;
		tipoMercaderiaId: number;
		valorDeclarado: string;
		volumenMetrosCubico: string;
		pesoMercaderia: string;
		cantidadBobinas: number | null;
		cantidadRacks: number | null;
		cantidadBultos: number | null;
		cantidadPallets: number | null;
		requisitosEspeciales: string | null;
		activo: boolean;
		estadoId: number | null;
		createdAt: string;
		updatedAt: string;
		tipoMercaderia: {
			id: number;
			nombre: string;
			descripcion: string;
			activo: boolean;
			createdAt: string;
			updatedAt: string;
		};
	};
}

export const remitosData = {
  "data": [
	{
	  "id": 6,
	  "numeroAsignado": "123414",
	  "fechaEmision": "2025-09-04T20:12:18.494Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "normal",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 5,
	  "createdAt": "2025-09-04T20:12:18.494Z",
	  "updatedAt": "2025-09-04T20:12:18.494Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Salta",
		"localidad": "11 de Septiembre",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 5,
		"tipoMercaderiaId": 1,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-04T20:12:18.306Z",
		"updatedAt": "2025-09-04T20:12:18.306Z",
		"tipoMercaderia": {
		  "id": 1,
		  "nombre": "Automotriz",
		  "descripcion": "Productos relacionados con la industria automotriz",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	},
	{
	  "id": 5,
	  "numeroAsignado": "123414122",
	  "fechaEmision": "2025-09-04T20:12:18.494Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "alta",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 5,
	  "createdAt": "2025-09-04T20:12:18.494Z",
	  "updatedAt": "2025-09-04T20:12:18.494Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Buenos Aires",
		"localidad": "Hurlingham",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 5,
		"tipoMercaderiaId": 1,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-04T20:12:18.306Z",
		"updatedAt": "2025-09-04T20:12:18.306Z",
		"tipoMercaderia": {
		  "id": 1,
		  "nombre": "Automotriz",
		  "descripcion": "Productos relacionados con la industria automotriz",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	},
	{
	  "id": 4,
	  "numeroAsignado": "123456780941",
	  "fechaEmision": "2025-09-04T19:23:25.398Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "normal",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 4,
	  "createdAt": "2025-09-04T19:23:25.398Z",
	  "updatedAt": "2025-09-04T19:23:25.398Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Buenos Aires",
		"localidad": "Moreno",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 4,
		"tipoMercaderiaId": 3,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-04T19:23:25.207Z",
		"updatedAt": "2025-09-04T19:23:25.207Z",
		"tipoMercaderia": {
		  "id": 3,
		  "nombre": "Alimentos",
		  "descripcion": "Productos alimenticios y bebidas",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	},
	{
	  "id": 3,
	  "numeroAsignado": "123456789111",
	  "fechaEmision": "2025-09-04T02:19:18.009Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "baja",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 3,
	  "createdAt": "2025-09-04T02:19:18.010Z",
	  "updatedAt": "2025-09-04T02:19:18.010Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Buenos Aires",
		"localidad": "11 de Septiembre",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 3,
		"tipoMercaderiaId": 3,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-04T02:19:17.821Z",
		"updatedAt": "2025-09-04T02:19:17.821Z",
		"tipoMercaderia": {
		  "id": 3,
		  "nombre": "Alimentos",
		  "descripcion": "Productos alimenticios y bebidas",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	},
	{
	  "id": 2,
	  "numeroAsignado": "12345678",
	  "fechaEmision": "2025-09-03T21:52:14.436Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "normal",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 2,
	  "createdAt": "2025-09-03T21:52:14.436Z",
	  "updatedAt": "2025-09-03T21:52:14.436Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Buenos Aires",
		"localidad": "11 de Septiembre",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 2,
		"tipoMercaderiaId": 1,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-03T21:52:14.248Z",
		"updatedAt": "2025-09-03T21:52:14.248Z",
		"tipoMercaderia": {
		  "id": 1,
		  "nombre": "Automotriz",
		  "descripcion": "Productos relacionados con la industria automotriz",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	},
	{
	  "id": 1,
	  "numeroAsignado": "7837291",
	  "fechaEmision": "2025-09-03T21:52:14.436Z",
	  "observaciones": "",
	  "archivoAdjunto": null,
	  "razonNoEntrega": null,
	  "prioridad": "normal",
	  "activo": true,
	  "clienteId": 1,
	  "destinoId": 1,
	  "estadoId": 1,
	  "estadoAnteriorId": null,
	  "mercaderiaId": 2,
	  "createdAt": "2025-09-03T21:52:14.436Z",
	  "updatedAt": "2025-09-03T21:52:14.436Z",
	  "destino": {
		"id": 1,
		"nombre": "Deposito",
		"pais": "Argentina",
		"provincia": "Buenos Aires",
		"localidad": "11 de Septiembre",
		"direccion": "Av. Rivadavia 1234",
		"activo": true,
		"createdAt": "2025-08-30T19:26:55.810Z",
		"updatedAt": "2025-08-30T19:26:55.810Z"
	  },
	  "cliente": {
		"id": 1,
		"razonSocial": "Empresa A S.A.",
		"cuit_rut": "20414636080",
		"direccion": "Av. Rivadavia 1234",
		"tipoEmpresaId": 2,
		"activo": true,
		"createdAt": "2025-08-30T19:27:19.869Z",
		"updatedAt": "2025-08-30T19:27:19.869Z"
	  },
	  "estado": {
		"id": 1,
		"nombre": "Autorizado",
		"createdAt": "2025-08-30T19:25:28.701Z",
		"updatedAt": "2025-08-30T19:25:28.701Z"
	  },
	  "mercaderia": {
		"id": 2,
		"tipoMercaderiaId": 1,
		"valorDeclarado": "1",
		"volumenMetrosCubico": "1",
		"pesoMercaderia": "1",
		"cantidadBobinas": null,
		"cantidadRacks": null,
		"cantidadBultos": null,
		"cantidadPallets": null,
		"requisitosEspeciales": null,
		"activo": true,
		"estadoId": null,
		"createdAt": "2025-09-03T21:52:14.248Z",
		"updatedAt": "2025-09-03T21:52:14.248Z",
		"tipoMercaderia": {
		  "id": 1,
		  "nombre": "Automotriz",
		  "descripcion": "Productos relacionados con la industria automotriz",
		  "activo": true,
		  "createdAt": "2025-08-30T19:25:29.064Z",
		  "updatedAt": "2025-08-30T19:25:29.064Z"
		}
	  }
	}
  ],
  "totalItems": 5,
  "totalPages": 1,
  "currentPage": 1
};