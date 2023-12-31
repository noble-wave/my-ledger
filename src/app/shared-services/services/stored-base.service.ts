import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AppBaseService } from './base.service';

export abstract class AppStoredBaseService<T> extends AppBaseService<T> {

  constructor(t: T, public name: string) {
    super(t);
    if (localStorage.getItem(this.name)) {
      try {
        let data = JSON.parse(localStorage.getItem(this.name)!);
        this.set(data);
      } catch (err) {
        console.error(err);
      }

    }
  }

  public setPersist(data: T) {
    if (data) {
      this.set(data);
      localStorage.setItem(this.name, JSON.stringify(data));
    } else {
      localStorage.removeItem(this.name);
    }
  }

}
