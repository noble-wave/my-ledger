import { ModelMeta } from '@app/shared-services';

export class AppSettings {
  id?: number;
  tag?: string;
  name: string;
}

export class OrderSettings extends AppSettings {
  // Used to set default order status of new Order
  defaultOrderStatus?: string; 
  manageOrderStatus: boolean;
  manageCustomer: boolean;
  manageProduct: boolean;
  manageDiscount: boolean;

  constructor() {
    super();
    this.name = 'orderSettings';
    this.defaultOrderStatus = '';
    this.manageOrderStatus = true;
    this.manageCustomer = true;
    this.manageProduct = true;
    this.manageDiscount = true;
  }
}

export function getOrderSettingMeta() {
  return [
    { key: 'defaultOrderStatus', label: 'Order Status Name', required: false },
    { key: 'manageOrderStatus', label: 'Manage Order Status', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'manageCustomer', label: 'Manage Customer', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'manageProduct', label: 'Manage Product', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'manageDiscount', label: 'Manage Discount', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'tag', label: 'Order Settings tag', required: false },
    { key: 'name', label: 'Order Settings', required: false },
    { key: 'id', label: 'Order Settings Id', required: false },

  ] as Array<ModelMeta>;
}
