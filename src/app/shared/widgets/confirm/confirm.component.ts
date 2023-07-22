import { Component, OnInit, Inject } from '@angular/core';
import { IConfirm } from '../../../shared-services/models';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IrsAlertComponent } from '@app/shared';

@Component({
  selector: 'irs-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class IrsConfirmComponent implements OnInit {

  actionDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<IrsAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public model: IConfirm
  ) {
  }

  ngOnInit() {
    if (this.model) {
      if (!this.model.title) {
        this.model.title = 'Confirm!';
      }
      if (!this.model.okLabel) {
        this.model.okLabel = 'Ok';
      }
      if (!this.model.cancelLabel) {
        this.model.cancelLabel = 'Cancel';
      }
    }

  }

  okAction() {
    this.actionDisabled = true;
    if (this.model.okAction) {
      this.model.okAction();
    }
    this.dialogRef.close('Ok');
  }

  cancelAction() {
    this.actionDisabled = true;
    if (this.model.cancelAction) {
      this.model.cancelAction();
    }
    this.dialogRef.close('Cancel');
  }

}
