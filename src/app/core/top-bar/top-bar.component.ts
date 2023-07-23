import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  institutionName: string;
  institutes$: Observable<any[]>;

  constructor(private service: CoreService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.institutes$ = this.service.current$.pipe(tap(institutes => {
      console.log('Institute list updated');
      // select the first one
      if (institutes && institutes.length > 0) {
        this.changeInstitute(institutes[0].id);
      }
    }));
  }

  changeInstitute(institutionId: number) {
    if (institutionId) {

      // const institution = this.institutionsStore.value.find(x => x.id === institutionId);
      // if (institution) {
      //   this.institutionName = institution.name;
      //   this.cdr.detectChanges();
      //   this.institutionStore.setPersist(institution);
      // }
    }
  }

}
