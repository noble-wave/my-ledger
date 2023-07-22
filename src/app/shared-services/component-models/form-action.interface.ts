import { OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export interface IFormAction extends OnInit, OnDestroy {
  isLoading: boolean;
  submitProcessing: boolean;
  disableSubmitButton: boolean;
  subscriptions: Array<Subscription>;

  onSubmit(): void;
  onResponse(data: any): void;
  submitProcessStart(): void;
  submitProcessComplete(): void;
  submitProcessError(): void;
}
