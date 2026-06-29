export interface IRefugio {
  id: string;
  nombre: string;
  ubicacion: {
    estado: string;
    municipio: string;
    parroquia: string;
    direccion: string;
  };
  tipo?: 'refugio' | 'punto_resguardo' | 'centro_acopio' | null;
  capacidad?: number | null;
  ocupacion_actual?: number | null;
  servicios?: string[] | null;
  coordinador?: string | null;
  contacto?: string | null;
  latitud?: number | null;
  longitud?: number | null;
  activo?: boolean | null;
  fuente?: 'oficial' | 'sociedad_civil' | null;
  created_at: Date;
  updated_at: Date;
}

export type CreateRefugioDTO = Pick<IRefugio, 'nombre' | 'ubicacion'> &
  Partial<Omit<IRefugio, 'id' | 'nombre' | 'ubicacion' | 'created_at' | 'updated_at'>>;

export type UpdateRefugioDTO = Partial<Omit<IRefugio, 'id' | 'created_at' | 'updated_at'>>;

export type RefugioFilters = {
  estado?: string;
  tipo?: string;
  activo?: string;
};
