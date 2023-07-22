import { Injectable } from '@angular/core';
import { IrsHttpService } from './http.service';
import { IrsBaseService } from './base.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IrsDtoMetadataService extends IrsBaseService<any> {

  private metadataApi = 'ModelMetadata';

  constructor(private http: IrsHttpService) {
    super({});
  }

  getMeta(dto: string): Observable<any> {
    const dtoSource = this.source.getValue()[dto];

    if (!dtoSource) {
      const ob = this.get(dto);
      ob.subscribe((x: any) => {
        if (x) {
          const data = this.source.getValue();
          data[dto] = x;
          this.set(data);
        }
      });
      return ob;
    } else {
      return of<any>(dtoSource);
    }

  }

  private get(dto: string) {
    return this.http.get(`${this.metadataApi}/${dto}`);
  }

}
