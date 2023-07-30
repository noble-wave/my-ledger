import { ModelMeta } from "@app/shared-services";

export interface Product {
    productId: string;
    productName: string;
    description?: string;
    imageUrl?: string;
    imageUrl2?: string;
    imageUrl3?: string;
    category?: string;
    isActive: boolean;
}


export function getProductMeta() {
    return [
        { key: 'productId', label: 'ProductId', hide: true },
        { key: 'productName', label: 'Product Name', required: true },
        { key: 'description', label: 'Description', required: true },
        { key: 'imageUrl', label: 'Image Url', required: true },
        { key: 'category', label: 'Category', required: true },
        { key: 'isActive', label: 'Is Active', controlType: 'radio', options: [{ key: true, value: 'Yes' }, { key: false, value: 'No' }] },
    ] as Array<ModelMeta>;

}