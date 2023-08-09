import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { IConfirm } from '../../shared-services/models';
import { map } from 'rxjs/operators';
import { IrsAlertService } from '../services/alert.service';
import { IAskLeavePage } from '@shared-services';

@Injectable({ providedIn: 'root' })
export class AskLeavePageGuard implements CanDeactivate<IAskLeavePage> {

  constructor(private alertService: IrsAlertService) { }

  canDeactivate(component: IAskLeavePage, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (component.askLeavePage && component.askLeavePage()) {
      // open dialog
      const model: IConfirm = {
        title: 'Are you sure you want to leave this page?',
        message: 'You have unsaved changes',
        okLabel: 'Leave',
        cancelLabel: 'Stay',
        okAction: () => { },
        cancelAction: () => { }
      };

      const ref = this.alertService.confirm(model);

      return ref.afterClosed()
        .pipe(map(x => {
          if (x === 'Ok') {
            return true;
          } else {
            return false;
          }
        }));
    } else {
      return true;
    }
  }

}
