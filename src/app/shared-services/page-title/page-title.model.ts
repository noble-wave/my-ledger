import { IPageAction } from './page-action.model';

export interface IPageTitleBar {
    title: string;
    actions?: IPageAction[];
}
