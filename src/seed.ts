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
      direccion: 'Parroquia San Bernardino, Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.5058,
    longitud: -66.9036,
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
    latitud: 10.5000,
    longitud: -66.9300,
    fuente: 'oficial',
  },
  {
    nombre: 'Instituto Nacional de Deportes (IND)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'El Paraíso',
      direccion: 'Montalbán, Sede del IND, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4800,
    longitud: -66.9300,
    fuente: 'oficial',
  },
  {
    nombre: 'Sede Ipostel (Centro Postal de Caracas)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'San Juan',
      direccion: 'Centro Postal de Caracas, Parroquia San Juan',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.4950,
    longitud: -66.9100,
    fuente: 'oficial',
  },
  {
    nombre: 'Liceo Andrés Bello',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'Catedral',
      direccion: 'Centro de Caracas',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.5050,
    longitud: -66.9100,
    fuente: 'oficial',
  },
  // ─── Caracas — Puntos de Resguardo ───
  {
    nombre: 'Parque Alí Primera',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'Catia',
      direccion: 'Catia, Oeste de Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.5100,
    longitud: -66.9500,
    fuente: 'oficial',
  },
  {
    nombre: 'Parque Generalísimo Francisco de Miranda',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Sucre',
      parroquia: 'Los Palos Grandes',
      direccion: 'Este de Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.4900,
    longitud: -66.8400,
    fuente: 'oficial',
  },
  {
    nombre: 'Plaza Altamira',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Chacao',
      parroquia: 'Altamira',
      direccion: 'Municipio Chacao, Caracas',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.4950,
    longitud: -66.8500,
    fuente: 'oficial',
  },
  {
    nombre: 'Plaza Bolívar de Chacao',
    ubicacion: {
      estado: 'Miranda',
      municipio: 'Chacao',
      parroquia: 'Chacao',
      direccion: 'Municipio Chacao, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4970,
    longitud: -66.8520,
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
    latitud: 10.4800,
    longitud: -66.8100,
    fuente: 'oficial',
  },
  // ─── La Guaira ───
  {
    nombre: 'Polideportivo José María Vargas',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Vargas',
      parroquia: 'La Guaira',
      direccion: 'Centro de La Guaira',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.6026,
    longitud: -66.9332,
    fuente: 'oficial',
  },
  {
    nombre: 'Estadio General en Jefe Jorge Luis García Carneiro',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Macuto',
      parroquia: 'Macuto',
      direccion: 'Macuto, Estado La Guaira',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.6100,
    longitud: -66.8900,
    fuente: 'oficial',
  },
  {
    nombre: 'Cancha de Paz de Playa Grande',
    ubicacion: {
      estado: 'La Guaira',
      municipio: 'Vargas',
      parroquia: 'Playa Grande',
      direccion: 'Playa Grande, Estado La Guaira',
    },
    tipo: 'punto_resguardo',
    activo: true,
    latitud: 10.6000,
    longitud: -66.9500,
    fuente: 'oficial',
  },
  // ─── Maracay — Aragua ───
  {
    nombre: 'Estadio José Pérez Colmenares',
    ubicacion: {
      estado: 'Aragua',
      municipio: 'Girardot',
      parroquia: 'Maracay',
      direccion: 'Maracay, Estado Aragua',
    },
    tipo: 'refugio',
    activo: true,
    latitud: 10.2469,
    longitud: -67.5958,
    fuente: 'oficial',
  },
  // ─── Otros puntos ───
  {
    nombre: 'Sede de la Federación Venezolana de Fútbol (FVF)',
    ubicacion: {
      estado: 'Distrito Capital',
      municipio: 'Libertador',
      parroquia: 'Sabana Grande',
      direccion: 'Sabana Grande, Caracas',
    },
    tipo: 'centro_acopio',
    activo: true,
    latitud: 10.4970,
    longitud: -66.8700,
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
