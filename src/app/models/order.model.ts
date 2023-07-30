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
export interface OrderItem {
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export enum OrderStatus {
    Pending = 'Pending',
    Processing = 'Processing',
    Shipped = 'Shipped',
    Delivered = 'Delivered',
    Cancelled = 'Cancelled',
}
