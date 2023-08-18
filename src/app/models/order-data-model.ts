import { Order, OrderItem, OrderStatus } from './order.model';
export interface OrderData {
    orders: Order[];
    orderItems: OrderItem[];
    orderStatuses: OrderStatus[];
  }