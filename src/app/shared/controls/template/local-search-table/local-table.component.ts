import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderBy, Query } from 'ngx-odata-v4';
import { merge, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Utility } from '../../../../shared-services/helpers/utility';
import { IrsAlertService } from '../../../services/alert.service';
import { Column, IConfirm, LocalTableSettings, RowAction, SearchTableSettings } from '../../../../shared-services/models';
import { IrsHttpService, IrsNotificationService } from '@shared-services';
import { ODataResult } from '../../../../shared-services/models/odata-query-result';
import { MatDialog } from '@angular/material/dialog';
import { ColumnOptionsDailogComponent } from './column-options-dailog/column-options-dailog.component';

// Include 'Actions' in Displayed columns list if actions are required
@Component({
  selector: 'irs-local-table',
  templateUrl: './local-table.component.html',
  styleUrls: ['./local-table.component.scss']
})
export class IrsLocalTableComponent implements OnInit, OnDestroy {

  @Input() settings: LocalTableSettings;
  @Input() data: Observable<any>;

  dataSource = new MatTableDataSource();
  // isLoadingResults = true;
  // isRateLimitReached = false;
  // refresh = new EventEmitter();
  isActionsVisible: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  displayColumns: Column[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    // Add action column if required
    if (
      this.settings.canGoToView ||
      this.settings.canGoToEdit ||
      this.settings.canGoToRemove ||
      this.settings.rowActions
    ) {
      this.settings.columns.push({ name: 'Actions$', text: 'Actions' });
      this.settings.displayColumns.push({ name: 'Actions$', text: 'Actions' });
      this.isActionsVisible = true;
    }

    // // If the user changes the sort order, reset back to the first page.
    // this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.data.subscribe((x: Array<any>) => {
      this.dataSource.data = x;
    })

    this.paginator.pageSize = this.settings.defaultPageSize;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.displayColumns = this.getDisplayColumnOptions();

  }

  ngAfterViewInit() {

    // this.paginator.pageSize = this.settings.defaultPageSize;
    // if (this.settings.defaultSortColumnName) {
    //   this.sort.active = this.settings.defaultSortColumnName;
    // }
    // this.sort.direction =
    //   this.settings.defaultSortDirection === 'desc' ? 'desc' : 'asc';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToView(id: number) {
    this.router.navigate(['view', id], { relativeTo: this.route });
  }

  goToEdit(id: number) {
    if (this.settings.canGoToEditCommands) {
      let commands = [...this.settings.canGoToEditCommands];
      commands.push(id);
      this.router.navigate(commands, { relativeTo: this.route });
    } else {
      this.router.navigate([id], { relativeTo: this.route });
    }
  }

  delete(id: number) {
    const model: IConfirm = {
      title: 'Delete',
      message: 'Are you sure to delete this record?',
      okAction: () => {

      }
    };
  }

  ngOnDestroy(): void { }

  getText(row: any, propertyName: string) {
    const propertyNames = propertyName.split('.');

    let value = row;

    propertyNames.forEach(item => {
      value = value[item];
    });

    return value;
  }

  getColumnNames() {
    return this.displayColumns.map(x => x.name);
  }

  getDisplayColumnOptions() {
    return this.settings.displayColumns.map((x, idx) => { return { name: x.name, text: x.text, order: x.order } as Column });
  }

  getColumnOptions() {
    return this.settings.columns.map((x, idx) => { return { name: x.name, text: x.text, order: x.order } as Column });
  }


  openOptions() {
    const dialogRef = this.dialog.open(ColumnOptionsDailogComponent, {
      data: {
        all: this.getColumnOptions(),
        includes: this.displayColumns,
      },
      position: { right: 'right' },
      height: 'calc( 100% - 128px)'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
