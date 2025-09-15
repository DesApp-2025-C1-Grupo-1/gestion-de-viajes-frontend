import axios from 'axios';
import { Remito } from '../services/remitos';

const API_BASE_URL = 'https://remitos-backend.onrender.com/remito';


interface FetchRemitosParams {
  page?: number;
  limit?: number;
  pais?: string;
  provincia?: string;
  localidad?: string;
}

export const fetchRemitos = async (params: FetchRemitosParams): Promise<Remito[]> => {
  const remitos = await axios.get(API_BASE_URL, {
    params: {
      page: params.page || 1,
      limit: params.limit || 1000,
      pais: params.pais || undefined,
      provincia: params.provincia || undefined,
      localidad: params.localidad || undefined,
      estadoId: 1, // Filtrar solo remitos con estadoId 1 (autorizado)
    },
  });
  
  return remitos.data.data;
}
