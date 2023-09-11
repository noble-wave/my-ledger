import { ModelMeta } from '@app/shared-services';

export class AppSettings {
  id?: number;
  tag?: string;
  name: string;
}

export class OrderSettings extends AppSettings {
  // Used to set default order status of new Order
  defaultOrderStatus?: string; 

  constructor() {
    super();
    this.name = 'orderSettings';
  }
}

export function getOrderSettingMeta() {
  return [
    { key: 'defaultOrderStatus', label: 'Order Status Name', required: true },
    { key: 'customer', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'product', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'discount', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    { key: 'tag', label: 'Order Status Name', required: false },
    { key: 'name', label: 'Order Status Name', required: false },
    { key: 'id', label: 'Order Status Name', required: false },

    // { key: 'isActive', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
  ] as Array<ModelMeta>;
}
