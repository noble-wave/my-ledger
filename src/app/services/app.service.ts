import { Injectable } from '@angular/core';
import { AppNotificationService, FormHelper, IrsPageTitleBarService, ModelMetaService } from '@app/shared-services';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(public meta: ModelMetaService, public noty: AppNotificationService, public title: IrsPageTitleBarService, public storage: StorageService) {
    FormHelper.notyInit(noty);
   }
}
