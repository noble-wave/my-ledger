import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshService {
  public isChnage$: BehaviorSubject<any> = new BehaviorSubject(null);
  constructor() {
    this.isChnage$ = new BehaviorSubject(false);
  }

}
