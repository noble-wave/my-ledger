import { ModelMeta } from '@app/shared-services';

export interface Sell {
  sellId?: string;
  sellNumber: string;
  customerId: string;
  customerName: string;
  customerPhoneNumber: string;
  // items: SellItem[];
  totalDiscount: number;
  totalQuantity: number;
  grossAmount: number;
  netAmount: number;
  sellDate: Date;
  status: SellStatus;
  userGstin: string;
  customerGstin: string;
  dueAmount: number;
}

export function getSellMeta() {
  return [
    { key: 'sellId', label: 'SellId', hide: true },
    { key: 'sellNumber', label: 'Sell Number' },
    { key: 'customerId', label: 'Customer Id' },
    { key: 'customerName', label: 'Customer Name' },
    { key: 'customerPhoneNumber', label: 'Customer Phone Number' },
    // { key: 'items', label: 'Items' },
    { key: 'totalDiscount', label: 'Total Discount' },
    { key: 'totalQuantity', label: 'Total Quantity' },
    { key: 'grossAmount', label: 'Gross Amount' },
    { key: 'netAmount', label: 'Net Amount' },
    { key: 'sellDate', label: 'Sell Date' },
    { key: 'status', label: 'Status' },
    { key: 'userGstin', label: 'User Gstin' },
    { key: 'customerGstin', label: 'Customer Gstin' },
    { key: 'dueAmount', label: 'Due Amount' },
  ] as Array<ModelMeta>;
}

export interface SellItem {
  sellItemId?: string;
  sellId?: string;
  productId: number;
  sellDate: Date;
  productName: string;
  quantity: number;
  discount: number;
  unitPrice: number;
  subtotal: number;
}

export function getSellItemMeta() {
  return [
    { key: 'sellItemId', label: 'SellItemId', hide: true },
    { key: 'sellId', label: 'sellId', hide: true },
    { key: 'productId', label: 'ProductId', hide: true },
    { key: 'sellDate', label: 'Sell Date' },
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

export interface SellPayment {
  paymentId: string;
  paymentDate: Date;
  amountPaid: number;
  sellId?: string;
  customerId: string;
}
export function getSellPaymentMeta() {
  return [
    { key: 'paymentId', label: 'PaymentId', hide: true },
    { key: 'paymentDate', label: 'Payment Date', required: true },
    { key: 'amountPaid', label: 'Amount Paid', required: true },
    { key: 'sellId', label: 'SellId', hide: true, required: true },
    { key: 'customerId', label: 'Customer Id' },
  ] as Array<ModelMeta>;
}

export interface Wallet {
  customerId: string;
  walletId?: string;
  walletAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}
export function getWalletMeta() {
  return [
    { key: 'customerId', label: 'Customer Id' },
    { key: 'walletId', label: 'Wallet Id', hide: true },
    { key: 'walletAmount', label: 'Wallet Amount', required: true },
    { key: 'createdAt', label: 'Created at', required: false },
    { key: 'updatedAt', label: 'Updated at', required: false },
  ] as Array<ModelMeta>;
}

export interface WalletHistory {
  walletHistoryId?: string;
  customerId: string;
  walletId: string;
  walletAmount: number;
  createdAt?: Date;
}
export function getWalletHistoryMeta() {
  return [
    { key: 'walletHistoryId', label: 'Wallet History Id', hide: true },
    { key: 'customerId', label: 'Customer Id' },
    { key: 'walletId', label: 'Wallet Id', hide: true },
    { key: 'walletAmount', label: 'Wallet Amount', required: true },
    { key: 'createdAt', label: 'Created at', required: false },
  ] as Array<ModelMeta>;
}
