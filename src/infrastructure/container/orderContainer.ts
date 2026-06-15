import { CreateOrder } from '@/application/use-cases/orders/CreateOrder';
import { GetOrders } from '@/application/use-cases/orders/GetOrders';
import { UpdateOrderStatus } from '@/application/use-cases/orders/UpdateOrderStatus';
import { LocalStorageOrderRepository } from '@/infrastructure/repositories/LocalStorageOrderRepository';

const orderRepository = new LocalStorageOrderRepository();

export const orderUseCases = {
  createOrder: new CreateOrder(orderRepository),
  getOrders: new GetOrders(orderRepository),
  updateOrderStatus: new UpdateOrderStatus(orderRepository),
};
