import 'dotenv/config';
import { connectDB } from './config/db';
import { RefugioModel } from './infrastructure/database/models/RefugioModel';

const refugios = [
  // ─── Caracas — Municipio Libertador ───
  {
    nombre: 'Complejo Cultural y Deportivo Guayana Esequiba',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'San Bernardino',
      direccion: 'Av. Los Próceres, Parroquia San Bernardino, Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.5147,
    longitud: -66.8964,
    fuente: 'oficial',
  },
  {
    nombre: 'Estadio Chato Candela',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: '23 de Enero',
      direccion: 'Zona F, Parroquia 23 de Enero, Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.5061,
    longitud: -66.9452,
    fuente: 'oficial',
  },
  {
    nombre: 'Instituto Nacional de Deportes (IND)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'El Paraíso',
      direccion: 'Av. Teherán, Velódromo Teo Capriles, Montalbán, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4731,
    longitud: -66.9478,
    fuente: 'oficial',
  },
  {
    nombre: 'Sede Ipostel (Centro Postal de Caracas)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'San Juan',
      direccion: 'Av. José Ángel Lamas, Urb. San Martín, Edif. Centro Postal de Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.4979,
    longitud: -66.9336,
    fuente: 'oficial',
  },
  {
    nombre: 'Liceo Andrés Bello',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'La Candelaria',
      direccion: 'Av. México, entre Parque Carabobo y Galería de Arte Nacional, Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.5014,
    longitud: -66.9037,
    fuente: 'oficial',
  },
  // ─── Caracas — Puntos de Resguardo ───
  {
    nombre: 'Parque Alí Primera',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'Catia',
      direccion: 'Av. Sucre, estación Gato Negro, Catia, Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.5139,
    longitud: -66.9394,
    fuente: 'oficial',
  },
  {
    nombre: 'Parque Generalísimo Francisco de Miranda',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Sucre',
      parroquia: 'Los Palos Grandes',
      direccion: 'Av. Francisco de Miranda, Este de Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.4925,
    longitud: -66.8392,
    fuente: 'oficial',
  },
  {
    nombre: 'Plaza Altamira',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Chacao',
      parroquia: 'Altamira',
      direccion: 'Av. Francisco de Miranda, Altamira, Municipio Chacao, Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.4960,
    longitud: -66.8489,
    fuente: 'oficial',
  },
  {
    nombre: 'Plaza Bolívar de Chacao',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Chacao',
      parroquia: 'Chacao',
      direccion: 'Av. Venezuela, Municipio Chacao, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4951,
    longitud: -66.8532,
    fuente: 'oficial',
  },
  {
    nombre: 'Coliseo de La Urbina (Petare)',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Sucre',
      parroquia: 'La Urbina',
      direccion: 'Prolongación Av. El Samán, Urbanización La Urbina',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.4820,
    longitud: -66.8150,
    fuente: 'oficial',
  },
  // ─── La Guaira ───
  {
    nombre: 'Polideportivo José María Vargas',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Vargas',
      parroquia: 'Carlos Soublette',
      direccion: 'Av. Carlos Soublette, Maiquetía, Estado La Guaira',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.6009,
    longitud: -66.9689,
    fuente: 'oficial',
  },
  {
    nombre: 'Estadio General en Jefe Jorge Luis García Carneiro',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Macuto',
      parroquia: 'Macuto',
      direccion: 'Av. La Playa, Macuto 1164, Estado La Guaira',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.6031,
    longitud: -66.9059,
    fuente: 'oficial',
  },
  {
    nombre: 'Cancha de Paz de Playa Grande',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Vargas',
      parroquia: 'Urimare',
      direccion: 'Av. Principal de Playa Grande, frente al conjunto residencial Hugo Chávez, Estado La Guaira',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.6088,
    longitud: -67.0160,
    fuente: 'oficial',
  },
  // ─── Maracay — Aragua ───
  {
    nombre: 'Estadio José Pérez Colmenares',
    ubicacion: {
      estado: 'Aragua',
      municipio: 'Girardot',
      parroquia: 'Maracay',
      direccion: 'Av. Las Delicias, Maracay, Estado Aragua',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.2605,
    longitud: -67.6114,
    fuente: 'oficial',
  },
  // ─── Otros puntos ───
  {
    nombre: 'Sede de la Federación Venezolana de Fútbol (FVF)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'Sabana Grande',
      direccion: 'Av. Casanova, Centro Comercial El Recreo, Torre Norte, Piso 15, Sabana Grande, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4918,
    longitud: -66.8771,
    fuente: 'sociedad_civil',
  },
];

async function seed(): Promise<void> {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[SEED] MONGO_URI no está definida');
    process.exit(1);
  }

  await connectDB(mongoUri);

  console.log('[SEED] Eliminando datos existentes...');
  await RefugioModel.deleteMany({});

  console.log(`[SEED] Insertando ${refugios.length} refugios...`);
  await RefugioModel.insertMany(refugios);

  console.log('[SEED] ¡Datos cargados exitosamente!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[SEED] Error:', err);
  process.exit(1);
});
