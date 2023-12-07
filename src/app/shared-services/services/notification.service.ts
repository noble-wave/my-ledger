import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class AppNotificationService {

  constructor(private _snackbar: MatSnackBar) { }

  notifyBadRoute(message?: string, action?: string) {
    this._snackbar.open(message || 'The server route looks bad', action || 'Not Found', {
      duration: 3000,
    });
  }

  notifyNotAllowed(message?: string, action?: string) {
    this._snackbar.open(message || 'Please contact admin to extend your role with App.', action || 'Not Authorize', {
      duration: 2000,
    });
  }

  notifySuccess(message: string, action?: string) {
    this._snackbar.open(message, action || 'Successully saved!', {
      duration: 4000,
    });
  }

  notifyAdded(message: string, action?: string) {
    this._snackbar.open(message, action || 'Successully added!', {
      duration: 4000,
    });
  }

  notifyClose(message: string, action?: string) {
    this._snackbar.open(message, action || 'Close!', {
      duration: 4000,
    });
  }

  notifyUpdated(message: string, action?: string) {
    this._snackbar.open(message, action || 'Successully updated!', {
      duration: 4000,
    });
  }

  notifyMessageOnly(message: string) {
    this._snackbar.open(message, '', {
      duration: 4000,
    });
  }

  notifyBadRequest(message: string, action?: string) {
    this._snackbar.open(message, action || 'Validation error', {
      duration: 2000,
    });
  }

  notifyLocalValidationError(message?: string, action?: string) {
    this._snackbar.open(message || 'Please check the form', action || 'Validation failed',
      {
        duration: 2000,
      });
  }

  notifyError(message?: string, action?: string) {
    this._snackbar.open(message || 'Please try again', action || 'Error occurred',
      {
        duration: 4000,
      });
  }

  notifyNoChange(message?: string, action?: string) {
    this._snackbar.open(message || 'No Change in form', action || 'Info',
      {
        duration: 4000,
      });
  }

}
