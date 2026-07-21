import { api } from './httpClient';
import type { PaginatedResponse } from './pagination';

export interface InventoryMovementDTO {
  id: string;
  tipo: 'ENTRADA' | 'SALIDA' | 'AJUSTE';
  productId?: string;
  rawMaterialId?: string;
  cantidad: number;
  ajuste?: number;
  motivo: string;
  usuarioId: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  productId?: string;
  rawMaterialId?: string;
  cantidad: number;
  ajuste?: number;
  motivo: string;
  usuarioId: string;
  fecha: string;
}

export function toInventoryMovement(dto: InventoryMovementDTO): InventoryMovement {
  return {
    id: dto.id,
    tipo: dto.tipo.toLowerCase() as InventoryMovement['tipo'],
    productId: dto.productId,
    rawMaterialId: dto.rawMaterialId,
    cantidad: dto.cantidad,
    ajuste: dto.ajuste,
    motivo: dto.motivo,
    usuarioId: dto.usuarioId,
    fecha: dto.fecha,
  };
}

export interface StockAlertDTO {
  id: string;
  insumo: string;
  codigo: string;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  fechaAlerta: string;
  estado: 'Pendiente' | 'Resuelta' | 'Critico';
  categoria: string;
  responsable: string;
  observaciones: string;
}

export interface StockAlert {
  id: string;
  insumo: string;
  codigo: string;
  stockActual: number;
  stockMinimo: number;
  diferencia: number;
  fechaAlerta: string;
  estado: 'Pendiente' | 'Resuelta' | 'Critico';
  categoria: string;
  responsable: string;
  observaciones: string;
}

export function toStockAlert(dto: StockAlertDTO): StockAlert {
  return {
    id: dto.id,
    insumo: dto.insumo,
    codigo: dto.codigo,
    stockActual: dto.stockActual,
    stockMinimo: dto.stockMinimo,
    diferencia: dto.diferencia,
    fechaAlerta: dto.fechaAlerta,
    estado: dto.estado,
    categoria: dto.categoria,
    responsable: dto.responsable,
    observaciones: dto.observaciones,
  };
}

export interface MovementsListResult {
  data: InventoryMovement[];
  meta: PaginatedResponse<InventoryMovementDTO>['meta'];
}

export interface StockAlertsListResult {
  data: StockAlert[];
  meta: PaginatedResponse<StockAlertDTO>['meta'];
}

export const inventoryApi = {
  async list(query?: Record<string, string | number | boolean | undefined | null>): Promise<MovementsListResult> {
    const response = await api.get<PaginatedResponse<InventoryMovementDTO>>('/stock/movements', { query });
    const data = (response?.data ?? []).map(toInventoryMovement);
    const meta = response?.meta ?? { totalRecords: 0, page: 1, limit: 10, totalPages: 1 };
    return { data, meta };
  },

  async create(m: Partial<InventoryMovement> & { usuarioId: string }): Promise<InventoryMovement> {
    const dto = await api.post<InventoryMovementDTO>('/stock/movements', {
      tipo: (m.tipo ?? 'entrada').toUpperCase() as InventoryMovementDTO['tipo'],
      productId: m.productId,
      rawMaterialId: m.rawMaterialId,
      cantidad: m.cantidad,
      ajuste: m.ajuste,
      motivo: m.motivo ?? '',
      usuarioId: m.usuarioId,
    });
    return toInventoryMovement(dto);
  },

  async listAlerts(query?: Record<string, string | number | boolean | undefined | null>): Promise<StockAlertsListResult> {
    const response = await api.get<PaginatedResponse<StockAlertDTO>>('/stock/alerts', { query });
    const data = (response?.data ?? []).map(toStockAlert);
    const meta = response?.meta ?? { totalRecords: 0, page: 1, limit: 10, totalPages: 1 };
    return { data, meta };
  },
};
