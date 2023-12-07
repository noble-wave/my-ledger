import { ModelMeta } from '@app/shared-services';

export interface Sell {
  sellId?: string;
  sellNumber: string;
  customerId: string;
  customerName: string;
  customerPhoneNumber: string;
  items: SellItem[];
  totalDiscount: Number;
  totalQuantity: Number;
  grossAmount: Number;
  netAmount: number;
  sellDate: Date;
  status: SellStatus;
  userGstin: string;
  customerGstin: string;
}

export function getSellMeta() {
  return [
    { key: 'sellId', label: 'SellId', hide: true },
    { key: 'sellNumber', label: 'Sell Number' },
    { key: 'customerId', label: 'Customer Id' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerPhoneNumber', label: 'Customer Phone Number' },
    { key: 'items', label: 'Items' },
    { key: 'totalDiscount', label: 'Total Discount' },
    { key: 'totalQuantity', label: 'Total Quantity' },
    { key: 'grossAmount', label: 'Gross Amount' },
    { key: 'netAmount', label: 'Net Amount' },
    { key: 'sellDate', label: 'Sell Date' },
    { key: 'status', label: 'Status' },
    { key: 'userGstin', label: 'User Gstin' },
    { key: 'customerGstin', label: 'Customer Gstin' },
  ] as Array<ModelMeta>;
}

export interface SellItem {
  productId: number;
  productName: string;
  quantity: number;
  discount: Number;
  unitPrice: number;
  subtotal: number;
}

export function getSellItemMeta() {
  return [
    { key: 'productId', label: 'ProductId', hide: true },
    { key: 'productName', label: 'Product Name', required: true },
    { key: 'quantity', label: 'Quantity', required: true },
    { key: 'discount', label: 'Discount' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'subtotal', label: 'Subtotal' },
  ] as Array<ModelMeta>;
}

export enum SellStatus {
  Pending = 'Pending',
  Processing = 'Processing',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
}
