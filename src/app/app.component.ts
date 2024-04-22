import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SocialService } from './services/social.service';
import { Gtag } from 'angular-gtag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'My Ledger';

  constructor(
    private router: Router,
    private socialService: SocialService,
    private gtag: Gtag
  ) {
    this.gtag.event('screen_view', {
      app_name: 'My Ledger',
      screen_name: 'Home',
    });
  }

  ngOnInit(): void {
    this.socialService.initAuthListener();
    this.router.events.subscribe((x) => {
      console.log(x);
    });
  }
}
