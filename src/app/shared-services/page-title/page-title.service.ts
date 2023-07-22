import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IPageTitleBar } from './page-title.model';
import { IrsBaseService } from '../services/base.service';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { IPageAction } from './page-action.model';

@Injectable({ providedIn: 'root' })
export class IrsPageTitleBarService extends IrsBaseService<IPageTitleBar> {

  constructor(private router: Router) {
    super({ title: '' });

    this.subscriptions[0] = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        // this.setFromRoute(router.routerState.root.firstChild as ActivatedRoute);
        this.set(undefined);
      }
    });
  }

  public overrideTitleOfRoute(title: string) {
    let value = this.source.getValue()
    if (value)
      value.title = title;
  }

  public setFromRoute(route: ActivatedRoute): void {
    const pageTitle: IPageTitleBar = this.getPageTitle(route);
    this.set(pageTitle);
  }

  public addAction(action: IPageAction): void {
    if (action && this.source) {
      const pageTitleBar = this.source.value;
      if (pageTitleBar) {

        if (!pageTitleBar.actions) { pageTitleBar.actions = []; }

        pageTitleBar.actions.push(action);
      }
    }
  }

  public disableAction(actionName: string) {
    this.disableEnableAction(actionName, true);
  }

  public enableAction(actionName: string) {
    this.disableEnableAction(actionName, false);
  }

  private disableEnableAction(actionName: string, isDisabled: boolean): void {
    if (actionName && this.source) {
      const pageTitleBar = this.source.value;
      if (pageTitleBar?.actions) {

        pageTitleBar.actions.filter(x => {
          if (x.actionName === actionName) {
            x.disabled = isDisabled;
          }
        });
      }
    }
  }

  private getPageTitle(route: ActivatedRoute): IPageTitleBar {
    if (route.children.length === 0) {
      return this.readTitleFromRoute(route);
    } else {
      return this.getPageTitle(route.firstChild as ActivatedRoute);
    }
  }

  private readTitleFromRoute(route: ActivatedRoute): IPageTitleBar {
    return { title: route.snapshot.data['title'] };
  }

}
