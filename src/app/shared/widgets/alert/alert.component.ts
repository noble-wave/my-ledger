import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { IAlert } from '../../../shared-services/models';

@Component({
  selector: 'irs-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class IrsAlertComponent implements OnInit {

  actionDisabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<IrsAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public model: IAlert
  ) {
  }

  ngOnInit() {
    if (this.model) {
      if (!this.model.title) {
        this.model.title = 'Alert!';
      }
      if (!this.model.okLabel) {
        this.model.okLabel = 'Ok';
      }
    }
  }

  okAction() {
    this.actionDisabled = true;
    this.model.okAction();
    this.dialogRef.close('Ok');
  }

}
