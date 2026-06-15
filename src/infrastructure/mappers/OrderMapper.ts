import { Order, type OrderItem, type OrderPriority, type OrderStatus } from '@/domain/entities/Order';

export interface OrderDTO {
  id: string;
  cliente: string;
  asesor: string;
  fecha: string;
  items: number;
  total: string | number;
  estado: OrderStatus;
  prioridad?: OrderPriority;
  observaciones?: string;
  itemsList?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

const monthMap: Record<string, string> = {
  Ene: '01',
  Feb: '02',
  Mar: '03',
  Abr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Ago: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dic: '12',
};

const parseCurrency = (value: string | number): number => {
  if (typeof value === 'number') return value;

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseLocalDate = (value: string): string => {
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value;

  const parts = value.trim().split(/\s+/);

  if (parts.length >= 3) {
    const day = parts[0].padStart(2, '0');
    const month = monthMap[parts[1]];
    const year = parts[2];

    if (month && /^\d{4}$/.test(year)) {
      return `${year}-${month}-${day}T00:00:00.000Z`;
    }
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

export class OrderMapper {
  static toDomain(dto: OrderDTO): Order {
    const itemsList = dto.itemsList ?? [];
    const itemsCount = Number.isInteger(dto.items)
      ? dto.items
      : itemsList.reduce((sum, item) => sum + item.cantidad, 0);
    const total = parseCurrency(dto.total);
    const createdAt = dto.createdAt ? parseLocalDate(dto.createdAt) : parseLocalDate(dto.fecha);
    const updatedAt = dto.updatedAt ?? createdAt;

    return new Order({
      id: dto.id,
      cliente: dto.cliente,
      asesor: dto.asesor,
      fecha: dto.fecha,
      items: itemsCount,
      total,
      estado: dto.estado,
      prioridad: dto.prioridad,
      observaciones: dto.observaciones,
      itemsList,
      createdAt,
      updatedAt,
    });
  }

  static toDTO(order: Order): OrderDTO {
    return {
      id: order.id,
      cliente: order.cliente,
      asesor: order.asesor,
      fecha: order.fecha,
      items: order.items,
      total: order.total,
      estado: order.estado,
      prioridad: order.prioridad,
      observaciones: order.observaciones,
      itemsList: order.itemsList,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}
