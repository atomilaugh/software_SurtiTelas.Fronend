import { api } from './httpClient';

export interface ProductionOrderDTO {
  id: string;
  pedidoId?: string;
  operarioId?: string;
  tallerId?: string;
  referencia: string;
  cantidad: number;
  fechaInicio: string;
  fechaEstimada: string;
  avance: number;
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'TERMINADO';
  tela?: string;
  colores: string[];
  curvaTallas?: Record<string, unknown>;
  notasTecnicas?: string;
  pedidoNumero?: string;
  pedidoCliente?: string;
  pedidoPrioridad?: string;
  pedidoItemNombre?: string;
  pedidoTotal?: number;
  taller?: { id: string; nombre: string; capacidad?: number };
  operario?: { id: string; nombre: string };
}

export interface ProductionOrder {
  id: string;
  pedidoId?: string;
  operarioId?: string;
  tallerId?: string;
  referencia: string;
  cantidad: number;
  fechaInicio: string;
  fechaEstimada: string;
  avance: number;
  estado: 'Pendiente' | 'En proceso' | 'Terminado';
  tela?: string;
  colores: string[];
  notasTecnicas?: string;
  taller?: { id: string; nombre: string; capacidad?: number };
  operario?: { id: string; nombre: string };
  pedidoNumero?: string;
  pedidoCliente?: string;
  pedidoPrioridad?: string;
  pedidoItemNombre?: string;
  pedidoTotal?: number;
}

export function toProductionOrder(dto: ProductionOrderDTO): ProductionOrder {
  return {
    id: dto.id,
    pedidoId: dto.pedidoId,
    operarioId: dto.operarioId,
    tallerId: dto.tallerId,
    referencia: dto.referencia,
    cantidad: dto.cantidad,
    fechaInicio: dto.fechaInicio,
    fechaEstimada: dto.fechaEstimada,
    avance: dto.avance,
    estado: dto.estado === 'EN_PROCESO' ? 'En proceso' : dto.estado === 'TERMINADO' ? 'Terminado' : 'Pendiente',
    tela: dto.tela,
    colores: dto.colores,
    notasTecnicas: dto.notasTecnicas,
    taller: dto.taller,
    operario: dto.operario,
    pedidoNumero: dto.pedidoNumero,
    pedidoCliente: dto.pedidoCliente,
    pedidoPrioridad: dto.pedidoPrioridad,
    pedidoItemNombre: dto.pedidoItemNombre,
    pedidoTotal: dto.pedidoTotal,
  };
}

export const productionApi = {
  async list(): Promise<ProductionOrder[]> {
    const response = await api.get<{ data: ProductionOrderDTO[]; meta: Record<string, unknown> }>('/production/orders');
    const data = response?.data ?? [];
    return data.map(toProductionOrder);
  },

  async assignToWorkshop(id: string, tallerId: string): Promise<ProductionOrder> {
    const dto = await api.post<ProductionOrderDTO>(
      `/production/orders/${encodeURIComponent(id)}/workshop`,
      { tallerId },
    );
    return toProductionOrder(dto);
  },

  async update(id: string, changes: Partial<ProductionOrder>): Promise<ProductionOrder> {
    let updated: ProductionOrder | null = null;
    if (changes.tallerId !== undefined) {
      updated = await productionApi.assignToWorkshop(id, changes.tallerId);
    }
    if (changes.operarioId !== undefined && !updated) {
      const dto = await api.post<ProductionOrderDTO>(
        `/production/orders/${encodeURIComponent(id)}/workshop`,
        { operarioId: changes.operarioId },
      );
      updated = toProductionOrder(dto);
    }
    if (changes.estado !== undefined) {
      if (changes.estado === 'Terminado') {
        const dto = await api.post<ProductionOrderDTO>(
          `/production/orders/${encodeURIComponent(id)}/complete`,
          {},
        );
        updated = toProductionOrder(dto);
      } else {
        const avance = changes.estado === 'En proceso' ? 50 : 0;
        const dto = await api.patch<ProductionOrderDTO>(
          `/production/orders/${encodeURIComponent(id)}/progress`,
          { avance },
        );
        updated = toProductionOrder(dto);
      }
    }
    if (updated) return updated;
    const lista = await productionApi.list();
    return lista.find((o) => o.id === id) ?? ({} as ProductionOrder);
  },
};
