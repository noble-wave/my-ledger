import { Component, OnInit, Input } from '@angular/core';
import { INavigationItem } from '@shared-services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'irs-index-template',
  templateUrl: './index-template.component.html',
})
export class IrsIndexComponent {

  @Input() links: INavigationItem[];

  constructor(private route: ActivatedRoute, private router: Router) { }

  goTo(path) {
    this.router.navigate([path], { relativeTo: this.route });
  }

}
