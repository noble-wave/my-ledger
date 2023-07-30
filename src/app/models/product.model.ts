import { ModelMeta } from "@app/shared-services";

export interface Product {
    productId?: string | number;
    productName: string;
    description?: string;
    imageUrl?: string;
    imageUrl2?: string;
    imageUrl3?: string;
    category?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}


export function getProductMeta() {
    return [
        { key: 'productId', label: 'ProductId', hide: true },
        { key: 'productName', label: 'Product Name', required: true },
        { key: 'description', label: 'Description', required: true },
        { key: 'imageUrl', label: 'Image Url', required: false },
        { key: 'category', label: 'Category', required: false },
        { key: 'isActive', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
        { key: 'createdAt', label: 'Created at', required: false },
        { key: 'updatedAt', label: 'Updated at', required: false },
    ] as Array<ModelMeta>;

}