import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({providedIn: 'root'})
export class IrsDialogService {

  constructor(public dialog: MatDialog) {


   }

  //  openDialog<T>(componentOrTemplateRef: ComponentType<T> | TemplateRef<T>) {
  //   const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
  //     width: '250px',
  //     // data: { name: this.name, animal: this.animal }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //     // this.animal = result;
  //   });
  // }

}
