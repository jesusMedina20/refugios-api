import { Schema, model, Types, Document } from 'mongoose';

export interface IRefugioDocument extends Document<Types.ObjectId> {
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

const refugioSchema = new Schema<IRefugioDocument>(
  {
    nombre: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    ubicacion: {
      estado: { type: String, required: true, trim: true },
      municipio: { type: String, required: true, trim: true },
      parroquia: { type: String, required: true, trim: true },
      direccion: { type: String, required: true, trim: true },
    },
    tipo: {
      type: String,
      enum: ['refugio', 'punto_resguardo', 'centro_acopio'],
      default: null,
    },
    capacidad: { type: Number, default: null },
    ocupacion_actual: { type: Number, default: null },
    servicios: { type: [String], default: null },
    coordinador: { type: String, default: null, trim: true },
    contacto: { type: String, default: null, trim: true },
    activo: { type: Boolean, default: true },
    latitud: { type: Number, default: null },
    longitud: { type: Number, default: null },
    fuente: {
      type: String,
      enum: ['oficial', 'sociedad_civil'],
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (_doc, ret) => {
        const obj = ret as Record<string, unknown>;
        obj.id = (obj._id as Types.ObjectId).toString();
        delete obj._id;
        delete obj.__v;
        return obj;
      },
    },
  }
);

refugioSchema.index({ 'ubicacion.estado': 1 });
refugioSchema.index({ tipo: 1 });

export const RefugioModel = model<IRefugioDocument>('Refugio', refugioSchema);
