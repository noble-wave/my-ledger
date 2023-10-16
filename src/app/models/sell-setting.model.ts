import { ModelMeta } from '@app/shared-services';

export class AppSettings {
  id?: number;
  tag?: string;
  name: string;
}

export class SellSettings extends AppSettings {
  // Used to set default sell status of new Sell
  defaultSellStatus?: string;
  manageSellStatus: boolean;
  manageCustomer: boolean;
  manageProduct: boolean;
  manageDiscount: boolean;
  manageGstin: boolean;

  constructor() {
    super();
    this.name = 'sellSettings';
    this.defaultSellStatus = 'Delivered';
    this.manageSellStatus = true;
    this.manageCustomer = true;
    this.manageProduct = true;
    this.manageDiscount = true;
    this.manageGstin = true;
  }
}

export function getSellSettingMeta() {
  return [
    { key: 'defaultSellStatus', label: 'Sell Status Name', required: false },
    {
      key: 'manageSellStatus',
      label: 'Manage Sell Status',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
    {
      key: 'manageCustomer',
      label: 'Manage Customer',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
    {
      key: 'manageProduct',
      label: 'Manage Product',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
    {
      key: 'manageDiscount',
      label: 'Manage Discount',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
    {
      key: 'manageGstin',
      label: 'Manage Gstin',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
    { key: 'tag', label: 'Sell Settings tag', required: false },
    { key: 'name', label: 'Sell Settings', required: false },
    { key: 'id', label: 'Sell Settings Id', required: false },
  ] as Array<ModelMeta>;
}

export class QuickSellSettings extends AppSettings {
  unitPrices: number[];
  manageQuickSell: boolean;

  constructor() {
    super();
    this.name = 'quickSellSettings';
    this.manageQuickSell = false;
    this.unitPrices = [10, 20, 50, 60];
  }
}

export function getQuickSellSettingMeta() {
  return [
    { key: 'unitPrices', label: 'Unit Prices' },
    {
      key: 'manageQuickSell',
      label: 'Manage Quick Sell',
      controlType: 'radio',
      options: [
        { key: true, value: 'Yes' },
        { key: false, value: 'No' },
      ],
    },
  ] as Array<ModelMeta>;
}
