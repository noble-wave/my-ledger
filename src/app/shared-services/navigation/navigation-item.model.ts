export interface INavigationItem {
  title: string;
  path: string;
  icon?: string;
  parent?: string;
  children?: INavigationItem[];
}
