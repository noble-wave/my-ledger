import { Component } from '@angular/core';
import { SettingService } from '@app/protected/services/setting.service';

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss']
})
export class QuickOrderComponent  {
  setting: any;

  constructor(
    private settingService: SettingService
  ) {}

  ngOnInit(): void {
    this.settingService.getQuickOrderSetting().subscribe((x) => {
      this.setting = { ...x };
      console.log('Setting data:', this.setting);
    });
    
  }
  

  saveOrder(){}

}
