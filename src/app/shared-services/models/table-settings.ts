export class TableSettings {
  oDataPath: string;
  columns: Array<Column>;
  searchQuery?: string;
  filterQuery?: string;
  expandQuery?: string;
  idColumnName = 'Id';
  defaultSortDirection: 'asc' | 'desc' | '' = 'desc';
  defaultSortColumnName: string;
  defaultPageSize = 10;

  // inbuilt actions with inbuild routes provide rowActions for custom actions
  canGoToView = false;
  canGoToEdit = false;
  canGoToRemove = false;
  rowActions?: Array<RowAction>;

  constructor(init?: Partial<TableSettings>) {
    Object.assign(this, init);
  }
}

export class SearchTableSettings extends TableSettings {
  override searchQuery?: string;
  searchWord?: string;

  constructor(init?: Partial<SearchTableSettings>) {
    super();
    Object.assign(this, init);
  }
}

export class Column {
  name: string;
  text?: string;
  order?: number;
}

export class RowAction {
  actionName: string;
  icon: string;
  disabled?: boolean;
  isHide?: boolean;
  callback?: (arg?: any) => any;
}

export class LocalTableSettings {
  tableIdentifier?: string; // should be unique for all tables, would be used for exclude columns list and etc
  columns: Array<Column>;
  displayColumns: Array<Column>;
  idColumnName = 'id';
  defaultSortDirection: 'asc' | 'desc' | '' = 'desc';
  defaultSortColumnName: string = 'id';
  defaultPageSize?= 10;

  // inbuilt actions with inbuild routes provide rowActions for custom actions
  canGoToView?= false;
  canGoToViewCommands?: Array<string | number> = undefined;
  canGoToEdit?= false;
  canGoToEditCommands?: Array<string | number> = undefined;
  canGoToRemove?= false;
  canGoToRemoveCommands?: Array<string | number> = undefined;
  rowActions?: Array<RowAction>;

  constructor(init?: Partial<LocalTableSettings>) {
    Object.assign(this, init);
  }
}
