import { Order, type OrderStatus } from '@/domain/entities/Order';
import type { CreateOrderInput, OrderRepository } from '@/domain/repositories/OrderRepository';
import { OrderMapper, type OrderDTO } from '@/infrastructure/mappers/OrderMapper';

const ORDERS_STORAGE_KEY = 'surti_pedidos';

export class LocalStorageOrderRepository implements OrderRepository {
  async list(): Promise<Order[]> {
    return this.readAll().map(OrderMapper.toDomain);
  }

  async getById(id: string): Promise<Order | null> {
    const order = this.readAll().find(item => item.id === id);
    return order ? OrderMapper.toDomain(order) : null;
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const now = new Date().toISOString();
    const existingOrders = this.readAll();
    const items = input.itemsList;
    const itemsCount = items.reduce((sum, item) => sum + item.cantidad, 0);
    const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const order = new Order({
      id: input.id ?? this.generateOrderId(existingOrders),
      cliente: input.cliente,
      asesor: input.asesor,
      fecha: input.fecha ?? now,
      items: itemsCount,
      total,
      estado: 'Nuevo',
      prioridad: input.prioridad ?? 'Estándar',
      observaciones: input.observaciones,
      itemsList: items,
      createdAt: now,
      updatedAt: now,
    });

    this.writeAll([OrderMapper.toDTO(order), ...existingOrders]);

    return order;
  }

  async updateStatus(id: string, estado: OrderStatus): Promise<Order> {
    const orders = this.readAll();
    const currentOrder = orders.find(order => order.id === id);

    if (!currentOrder) {
      throw new Error('Pedido no encontrado');
    }

    const domainOrder = OrderMapper.toDomain(currentOrder);
    const updatedOrder = domainOrder.withStatus(estado);
    const nextOrders = orders.map(order =>
      order.id === id ? OrderMapper.toDTO(updatedOrder) : order
    );

    this.writeAll(nextOrders);

    return updatedOrder;
  }

  private readAll(): OrderDTO[] {
    try {
      const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);

      if (!raw) return [];

      const parsed = JSON.parse(raw);

      return Array.isArray(parsed) ? parsed as OrderDTO[] : [];
    } catch {
      return [];
    }
  }

  private writeAll(orders: OrderDTO[]): void {
    try {
      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      return;
    }
  }

  private generateOrderId(orders: OrderDTO[]): string {
    const max = orders.reduce((currentMax, order) => {
      const match = order.id.match(/\d+/);

      if (!match) return currentMax;

      return Math.max(currentMax, Number.parseInt(match[0], 10));
    }, 2400);

    return `#PD-${String(max + 1).padStart(4, '0')}`;
  }
}
