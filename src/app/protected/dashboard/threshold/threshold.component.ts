import { Component } from '@angular/core';
import { ProductService } from '@app/protected/services/product.service';

@Component({
  selector: 'app-threshold',
  templateUrl: './threshold.component.html',
  styleUrls: ['./threshold.component.scss']
})
export class ThresholdComponent {
  warnthreshold: any;
  infothreshold: any;
  allInventory: any;

  constructor(private service:ProductService) {}
  ngOnInit(): void {
    this.service.getInventoryWarnThreshold().subscribe((x)=>
    this.warnthreshold = x);
    this.service.getInventoryInfoThreshold().subscribe((x)=>
    this.infothreshold = x);
    this.service.getAllInventory().subscribe((x)=>
    this.allInventory = x);
  }

}
