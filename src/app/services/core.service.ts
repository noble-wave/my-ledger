import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  appData$: BehaviorSubject<any>;

  constructor() {
    this.appData$ = new BehaviorSubject<any>({});
  }
}
