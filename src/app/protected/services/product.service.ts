import { Injectable } from '@angular/core';
import { Product } from '@app/models/product.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  get(id: string) {
    return of({});
  }

  save(value: Product) {
    return of({});
  }

}
