import { Injectable, TemplateRef, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IrsAlertComponent } from '../widgets/alert/alert.component';
import { IConfirm, IAlert } from '../../shared-services/models';
import { IrsConfirmComponent } from '../widgets/confirm/confirm.component';

@Injectable({providedIn: 'root'})
export class IrsAlertService {

  constructor(public dialog: MatDialog) {
  }

  alert(model: IAlert) {
    const dialogRef = this.dialog.open(IrsAlertComponent, {
      disableClose: true,
      data: { title: model.title, message: model.message, okAction: model.okAction }
    });

  }

  confirm(model: IConfirm): MatDialogRef<IrsConfirmComponent> {
    return this.dialog.open(IrsConfirmComponent, {
      disableClose: true,
      data: {
        title: model.title, message: model.message, okAction: model.okAction, cancelAction: model.cancelAction,
        okLabel: model.okLabel, cancelLabel: model.cancelLabel
      }
    });
  }

}



