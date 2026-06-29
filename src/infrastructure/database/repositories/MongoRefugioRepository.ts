import mongoose from 'mongoose';
import { IRefugioRepository } from '../../../domain/repositories/IRefugioRepository';
import {
  IRefugio,
  CreateRefugioDTO,
  UpdateRefugioDTO,
  RefugioFilters,
} from '../../../domain/entities/Refugio';
import { RefugioModel, IRefugioDocument } from '../models/RefugioModel';
import { AppError } from '../../../shared/errors/AppError';

function toDomain(doc: IRefugioDocument): IRefugio {
  return doc.toJSON() as unknown as IRefugio;
}

function ensureConnected(): void {
  // readyState: 0=disconnected, 1=connected
  if (mongoose.connection.readyState !== 1) {
    throw new AppError(
      'SERVICE_UNAVAILABLE',
      'Base de datos no disponible',
      503
    );
  }
}

export class MongoRefugioRepository implements IRefugioRepository {
  async findAll(filters?: RefugioFilters): Promise<IRefugio[]> {
    ensureConnected();
    const query: Record<string, unknown> = {};

    if (filters?.estado) {
      query['ubicacion.estado'] = { $regex: filters.estado, $options: 'i' };
    }

    if (filters?.tipo) {
      query.tipo = filters.tipo;
    }

    if (filters?.activo !== undefined) {
      query.activo = filters.activo === 'true';
    }

    const docs = await RefugioModel.find(query).sort({ created_at: -1 }).lean();
    return docs.map((doc) => ({
      ...doc,
      id: doc._id.toString(),
    })) as unknown as IRefugio[];
  }

  async findById(id: string): Promise<IRefugio | null> {
    ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('VALIDATION_ERROR', 'ID inválido', 400);
    }

    const doc = await RefugioModel.findById(id);
    if (!doc) return null;

    return toDomain(doc);
  }

  async create(data: CreateRefugioDTO): Promise<IRefugio> {
    ensureConnected();
    const doc = await RefugioModel.create(data);
    return toDomain(doc);
  }

  async update(id: string, data: UpdateRefugioDTO): Promise<IRefugio | null> {
    ensureConnected();
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('VALIDATION_ERROR', 'ID inválido', 400);
    }

    const doc = await RefugioModel.findByIdAndUpdate(
      id,
      { ...data, updated_at: new Date() },
      { new: true, runValidators: true }
    );
    if (!doc) return null;

    return toDomain(doc);
  }
}
