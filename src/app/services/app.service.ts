import { Injectable } from '@angular/core';
import { AppNotificationService, IrsPageTitleBarService, ModelMetaService } from '@app/shared-services';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public meta: ModelMetaService, public noty: AppNotificationService, public title: IrsPageTitleBarService,) { }
}
