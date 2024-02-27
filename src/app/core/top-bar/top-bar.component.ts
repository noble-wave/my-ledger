import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CoreService } from '../../services/core.service';
import { SocialService } from '@app/services/social.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  institutionName: string;
  institutes$: Observable<any[]>;
  userInfo: any;

  constructor(
    private service: CoreService,
    private cdr: ChangeDetectorRef,
    private socialService: SocialService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socialService.$userData.subscribe((x) => {
      this.userInfo = x;
    });
    this.institutes$ = this.service.appData$.pipe(
      tap((institutes) => {
        console.log('Institute list updated');
        // select the first one
        if (institutes && institutes.length > 0) {
          this.changeInstitute(institutes[0].id);
        }
      })
    );
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

  signOut(): void {
    this.socialService.signOut();
  }

  signIn() {
    this.router.navigate(['/login'], {});
  }
}
