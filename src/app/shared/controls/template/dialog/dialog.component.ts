// import { ChangeDetectorRef, Component, Inject, Input, Optional } from '@angular/core';
// import { MatDialogRef } from '@angular/material/dialog';
// import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

// @Component({
//   selector: 'app-dialog',
//   templateUrl: './dialog.component.html',
//   styleUrls: ['./dialog.component.scss'],
// })
// export class DialogComponent {
//   @Input() dialogTitle: string;
//   @Input() dialogContent: string;
//   @Input() cancelButtonText: string;
//   @Input() confirmButtonText: string;
//   @Input() color: string = 'primary'; // Default to 'primary'

//   // Map color names to their respective color codes
//   private colorMap: { [key: string]: string } = {
//     primary: '#1976d2',
//     accent: '#ff9800',
//     warn: '#f44336',
//     disable: '#9e9e9e',
//     link: '#2196f3',
//     // Add more color mappings as needed
//   };

//   constructor(
//     public dialogRef: MatDialogRef<DialogComponent>,
//     private cdr: ChangeDetectorRef,
//     @Optional() @Inject(MAT_DIALOG_DATA) public data: {}

//   ) {}

//   getColorCode(): string {
//     // Return the color code based on the provided color name
//     return this.colorMap[this.color] || this.colorMap['primary'];
//   }

//   // Call this method if data changes asynchronously
//   updateData(newData: any): void {
//     this.dialogTitle = newData.title;
//     // Update other input properties as needed

//     // Trigger change detection
//     this.cdr.detectChanges();
//   }

//   onConfirm(): void {
//     this.dialogRef.close(true);
//   }

//   onCancel(): void {
//     this.dialogRef.close(false);
//   }
// }

import { Component, Inject, Optional, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  @Input() enterAnimationDuration: string;
  @Input() exitAnimationDuration: string;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // ...

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
