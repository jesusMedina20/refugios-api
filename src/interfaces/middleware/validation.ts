import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { AppError } from '../../shared/errors/AppError';

const phoneRegex = /^\+?[\d\s\-()]{7,15}$/;

export const createRefugioSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').max(200),
  ubicacion: z.object({
    estado: z.string().min(1, 'El estado es requerido'),
    municipio: z.string().min(1, 'El municipio es requerido'),
    parroquia: z.string().min(1, 'La parroquia es requerida'),
    direccion: z.string().min(1, 'La dirección es requerida'),
  }),
  tipo: z.enum(['refugio', 'punto_resguardo', 'centro_acopio']).optional().nullable(),
  capacidad: z.number().int().positive().optional().nullable(),
  ocupacion_actual: z.number().int().min(0).optional().nullable(),
  servicios: z.array(z.string()).optional().nullable(),
  coordinador: z.string().min(2).optional().nullable(),
  contacto: z.string().regex(phoneRegex).optional().nullable(),
  activo: z.boolean().optional().default(true),
  fuente: z.enum(['oficial', 'sociedad_civil']).optional().nullable(),
});

export const updateRefugioSchema = z.object({
  nombre: z.string().min(3).max(200).optional(),
  ubicacion: z
    .object({
      estado: z.string().min(1),
      municipio: z.string().min(1),
      parroquia: z.string().min(1),
      direccion: z.string().min(1),
    })
    .optional(),
  tipo: z.enum(['refugio', 'punto_resguardo', 'centro_acopio']).optional().nullable(),
  capacidad: z.number().int().positive().optional().nullable(),
  ocupacion_actual: z.number().int().min(0).optional().nullable(),
  servicios: z.array(z.string()).optional().nullable(),
  coordinador: z.string().min(2).optional().nullable(),
  contacto: z.string().regex(phoneRegex).optional().nullable(),
  activo: z.boolean().optional(),
  fuente: z.enum(['oficial', 'sociedad_civil']).optional().nullable(),
});

export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formatted = result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`
      );

      throw new AppError('VALIDATION_ERROR', 'Datos inválidos', 400, formatted);
    }

    req.body = result.data;
    next();
  };
}
