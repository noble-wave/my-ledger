import { ModelMeta } from '@app/shared-services';

export interface Order {
  orderId?: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  orderDate: Date;
  status: OrderStatus;
}

export function getOrderMeta() {
  return [
    { key: 'orderId', label: 'OrderId', hide: true },
    { key: 'orderNumber', label: 'Order Number' },
    { key: 'customerId', label: 'Customer Id' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'items', label: 'Items' },
    { key: 'totalAmount', label: 'Total Amount' },
    { key: 'orderDate', label: 'Order Date' },
    { key: 'status', label: 'Status' },
  ] as Array<ModelMeta>;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export function getOrderItemMeta() {
  return [
    { key: 'productId', label: 'ProductId', hide: true },
    { key: 'productName', label: 'Product Name', required: true },
    { key: 'quantity', label: 'Quantity', required: true },
    { key: 'unitPrice', label: 'Unit Price', },
    { key: 'subtotal', label: 'Subtotal' },

  ] as Array<ModelMeta>;
}

export enum OrderStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}

