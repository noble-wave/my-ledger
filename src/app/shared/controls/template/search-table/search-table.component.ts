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
import { merge, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Utility } from '../../../../shared-services/helpers/utility';
import { IrsAlertService } from '../../../services/alert.service';
import { IConfirm, RowAction, SearchTableSettings } from '../../../../shared-services/models';
import { IrsHttpService, IrsNotificationService } from '@shared-services';
import { ODataResult } from '../../../../shared-services/models/odata-query-result';

// Include 'Actions' in Displayed columns list if actions are required
@Component({
  selector: 'irs-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss']
})
export class IrsSearchTableComponent implements OnInit, OnDestroy {
  @Input()
  columnOptions: Array<string>;
  @Input()
  displayedColumnText: Array<string>;

  @Input()
  idColumnName = 'Id';
  @Input()
  defaultSortColumnName: string;
  @Input()
  defaultSortDirection = 'asc';
  @Input()
  defaultPageSize = 10;
  @Input()
  oDataPath: string; // example: ${ODataContext.ODataRootPath}ExamType?
  @Input()
  searchWord?: string; // could be provided. Most of the time search word is read from UI inside this control
  @Input()
  searchQuery: string;
  @Input()
  filterQuery = '';
  @Input()
  expandQuery: string;

  @Input()
  canGoToView = false;
  @Input()
  canGoToEdit = false;
  @Input()
  canGoToRemove = false;
  @Input()
  rowActions: Array<RowAction>;

  @Input()
  searchTableSettings: SearchTableSettings;

  dataSource = new MatTableDataSource();
  isLoadingResults = true;
  isRateLimitReached = false;
  refresh = new EventEmitter();
  isActionsVisible: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: IrsHttpService,
    private notificationService: IrsNotificationService,
    private alertService: IrsAlertService
  ) { }

  ngOnInit() {
    // Add action column if required
    if (
      this.searchTableSettings.canGoToView ||
      this.searchTableSettings.canGoToEdit ||
      this.searchTableSettings.canGoToRemove ||
      this.searchTableSettings.rowActions
    ) {
      this.searchTableSettings.columns.push({ name: 'Actions$' });
      this.isActionsVisible = true;
    }

    // set inital values

    this.paginator.pageSize = this.searchTableSettings.defaultPageSize;
    if (this.searchTableSettings.defaultSortColumnName) {
      this.sort.active = this.searchTableSettings.defaultSortColumnName;
    }
    this.sort.direction =
      this.searchTableSettings.defaultSortDirection === 'desc' ? 'desc' : 'asc';

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.refresh)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // return this.service.getPage(this.paginator.pageIndex + 1, this.paginator.pageSize, 'firstName', this.sort.direction);
          // this.sort.active, this.sort.direction, this.paginator.pageIndex);
          // return this.service.Query().OrderBy('name').Skip(this.paginator.pageIndex).Top(this.paginator.pageSize).Exec();
          const orderBy =
            this.sort.direction === 'desc' ? OrderBy.Desc : OrderBy.Asc;

          const searchQuery = this.searchTableSettings.searchWord
            ? Utility.replaceAll(this.searchTableSettings.searchQuery, '@searchWord', this.searchTableSettings.searchWord)
            : '';

          const query = Query.create()
            .orderBy(this.sort.active, orderBy)
            .skip(this.paginator.pageIndex)
            .top(this.paginator.pageSize)
            .count(true);

          return this.http.getOdata(
            `${this.searchTableSettings.oDataPath}?${query.compile()}&${this.searchTableSettings.filterQuery
            }&${searchQuery}&${this.searchTableSettings.expandQuery}`
          );
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe((odataResult: ODataResult<any>) => {
        this.paginator.length = odataResult['@odata.count'];
        this.dataSource.data = odataResult.value;
      });
  }

  searched(searchWord: string) {
    this.searchTableSettings.searchWord = searchWord;
    this.refresh.emit();
  }

  goToView(id: number) {
    this.router.navigate(['view', id], { relativeTo: this.route });
  }

  goToEdit(id: number) {
    this.router.navigate(['edit', id], { relativeTo: this.route });
  }

  remove(id: number) {
    const model: IConfirm = {
      title: 'Delete',
      message: 'Are you sure to delete this record?',
      okAction: () => {
        this.http
          .deleteOdata(`${this.searchTableSettings.oDataPath}`, id)
          .subscribe(x => {
            this.refresh.emit();
          });
      }
    };

    this.alertService.confirm(model);
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

  getColumns() {
    return this.searchTableSettings.columns.map(x => x.name);
  }
}
