export interface Country {
  _id: string;
  nombre_comercial: string;
  codigo: string;
  provincias: Province[];
}

export interface Province {
  id: string;
  nombre: string;
}

export const countriesData: Country[] = [
  {
    _id: 'ARG',
    nombre_comercial: 'Argentina',
    codigo: 'AR',
    provincias: [
      { id: '1', nombre: 'Buenos Aires' },
      { id: '2', nombre: 'Catamarca' },
      { id: '3', nombre: 'Chaco' },
      { id: '4', nombre: 'Chubut' },
      { id: '5', nombre: 'Córdoba' },
      { id: '6', nombre: 'Corrientes' },
      { id: '7', nombre: 'Entre Ríos' },
      { id: '8', nombre: 'Formosa' },
      { id: '9', nombre: 'Jujuy' },
      { id: '10', nombre: 'La Pampa' },
      { id: '11', nombre: 'La Rioja' },
      { id: '12', nombre: 'Mendoza' },
      { id: '13', nombre: 'Misiones' },
      { id: '14', nombre: 'Neuquén' },
      { id: '15', nombre: 'Río Negro' },
      { id: '16', nombre: 'Salta' },
      { id: '17', nombre: 'San Juan' },
      { id: '18', nombre: 'San Luis' },
      { id: '19', nombre: 'Santa Cruz' },
      { id: '20', nombre: 'Santa Fe' },
      { id: '21', nombre: 'Santiago del Estero' },
      { id: '22', nombre: 'Tierra del Fuego' },
      { id: '23', nombre: 'Tucumán' }
    ]
  },
  {
    _id: 'BRA',
    nombre_comercial: 'Brasil',
    codigo: 'BR',
    provincias: [
      { id: '1', nombre: 'Acre' },
      { id: '2', nombre: 'Alagoas' },
      { id: '3', nombre: 'Amapá' },
      { id: '4', nombre: 'Amazonas' },
      { id: '5', nombre: 'Bahia' },
      { id: '6', nombre: 'Ceará' },
      { id: '7', nombre: 'Distrito Federal' },
      { id: '8', nombre: 'Espírito Santo' },
      { id: '9', nombre: 'Goiás' },
      { id: '10', nombre: 'Maranhão' },
      { id: '11', nombre: 'Mato Grosso' },
      { id: '12', nombre: 'Mato Grosso do Sul' },
      { id: '13', nombre: 'Minas Gerais' },
      { id: '14', nombre: 'Pará' },
      { id: '15', nombre: 'Paraíba' },
      { id: '16', nombre: 'Paraná' },
      { id: '17', nombre: 'Pernambuco' },
      { id: '18', nombre: 'Piauí' },
      { id: '19', nombre: 'Rio de Janeiro' },
      { id: '20', nombre: 'Rio Grande do Norte' },
      { id: '21', nombre: 'Rio Grande do Sul' },
      { id: '22', nombre: 'Rondônia' },
      { id: '23', nombre: 'Roraima' },
      { id: '24', nombre: 'Santa Catarina' },
      { id: '25', nombre: 'São Paulo' },
      { id: '26', nombre: 'Sergipe' },
      { id: '27', nombre: 'Tocantins' }
    ]
  }
];