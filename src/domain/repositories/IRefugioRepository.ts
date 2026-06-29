import { IRefugio, CreateRefugioDTO, UpdateRefugioDTO, RefugioFilters } from '../entities/Refugio';

export interface IRefugioRepository {
  findAll(filters?: RefugioFilters): Promise<IRefugio[]>;
  findById(id: string): Promise<IRefugio | null>;
  create(data: CreateRefugioDTO): Promise<IRefugio>;
  update(id: string, data: UpdateRefugioDTO): Promise<IRefugio | null>;
}
