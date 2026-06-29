import { Request, Response } from 'express';
import { IRefugioRepository } from '../../domain/repositories/IRefugioRepository';
import {
  CreateRefugioDTO,
  UpdateRefugioDTO,
  RefugioFilters,
} from '../../domain/entities/Refugio';
import { AppError } from '../../shared/errors/AppError';

export class RefugioController {
  constructor(private readonly repository: IRefugioRepository) {}

  async getAll(req: Request, res: Response): Promise<void> {
    const estado = req.query.estado;
    const tipo = req.query.tipo;
    const activo = req.query.activo;

    const filters: RefugioFilters = {
      estado: typeof estado === 'string' ? estado : undefined,
      tipo: typeof tipo === 'string' ? tipo : undefined,
      activo: typeof activo === 'string' ? activo : undefined,
    };

    // Validar tipo si viene
    const validTipos: string[] = ['refugio', 'punto_resguardo', 'centro_acopio'];
    if (filters.tipo && !validTipos.includes(filters.tipo)) {
      throw new AppError(
        'VALIDATION_ERROR',
        "Tipo inválido. Valores válidos: refugio, punto_resguardo, centro_acopio",
        400
      );
    }

    const refugios = await this.repository.findAll(filters);

    res.json({
      success: true,
      data: refugios,
      count: refugios.length,
    });
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;

    const refugio = await this.repository.findById(id);

    if (!refugio) {
      throw new AppError('NOT_FOUND', `Refugio con id '${id}' no encontrado`, 404);
    }

    res.json({
      success: true,
      data: refugio,
    });
  }

  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateRefugioDTO;
    const refugio = await this.repository.create(data);

    res.status(201).json({
      success: true,
      data: refugio,
    });
  }

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const data = req.body as UpdateRefugioDTO;

    const refugio = await this.repository.update(id, data);

    if (!refugio) {
      throw new AppError('NOT_FOUND', `Refugio con id '${id}' no encontrado`, 404);
    }

    res.json({
      success: true,
      data: refugio,
    });
  }

  async replace(req: Request, res: Response): Promise<void> {
    const id = req.params.id as string;
    const data = req.body as CreateRefugioDTO;

    const exists = await this.repository.findById(id);
    if (!exists) {
      throw new AppError('NOT_FOUND', `Refugio con id '${id}' no encontrado`, 404);
    }

    const refugio = await this.repository.update(id, data);

    res.json({
      success: true,
      data: refugio,
    });
  }
}
