import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IrsBaseService } from '../services/base.service';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd, Route } from '@angular/router';
import { INavigationItem } from './navigation-item.model';
import { navigationMenu } from './navigation';

@Injectable({ providedIn: 'root' })
export class IrsNavigationService extends IrsBaseService<Array<INavigationItem>> implements OnInit {

  constructor(private router: Router) {
    super([]);
  }

  ngOnInit(): void {
  }

  public initNavigation() {
    this.source.next(navigationMenu);
  }

  // not in use
  public buildNavigationFromRoutes() {
    const navItems: INavigationItem[] = [];

    this.router.config.forEach(route => {
      const navItem = this.buildNavigationFromRoute(route, '');

      if (navItem) {
        navItems.push(navItem);
      }
    });

    this.source.next(navItems);
  }

  // not in use
  private buildNavigationFromRoute(route: Route, routePrefix: string): INavigationItem | null {
    if (!route.data || !route.data['title']) {
      return null;
    }

    const navItem: INavigationItem = {
      path: routePrefix + route.path,
      title: route.data['title'],
      icon: route.data['icon'],
      children: []
    };

    if (route.children) {
      route.children.forEach(childRoute => {
        const childNavItem = this.buildNavigationFromRoute(childRoute, navItem.path + '/');

        if (navItem && navItem.children && childNavItem) {
          navItem.children.push(childNavItem);
        }
      });
    }

    return navItem;
  }

}
