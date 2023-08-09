import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Column } from '@app/shared-services';
import { ColumnDataModel } from './column-options.model';

@Component({
  selector: 'app-column-options-dailog',
  templateUrl: './column-options-dailog.component.html',
  styleUrls: ['./column-options-dailog.component.scss']
})
export class ColumnOptionsDailogComponent implements OnInit {
  includes: Column[];
  excludes: Column[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: ColumnDataModel) { }

  ngOnInit(): void {
    this.includes = this.data.includes;
    this.excludes = this.data.all.filter(item => this.data.includes.findIndex(y => item.name == y.name) == -1);;
  }

  drop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      event.container.data.order = event.currentIndex;
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      event.container.data.order = event.currentIndex;
    }
  }

}
