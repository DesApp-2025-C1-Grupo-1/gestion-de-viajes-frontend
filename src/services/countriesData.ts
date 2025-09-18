export interface Country {
  _id: string;
  nombre_comercial: string;
  codigo: string;
}


export const countriesData: Country[] = [
  {
    _id: 'ARG',
    nombre_comercial: 'Argentina',
    codigo: 'AR',
  },
  {
    _id: 'BRA',
    nombre_comercial: 'Brasil',
    codigo: 'BR'
  }
];