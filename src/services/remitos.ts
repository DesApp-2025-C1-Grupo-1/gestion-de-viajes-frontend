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
