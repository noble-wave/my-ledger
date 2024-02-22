import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialService } from './services/social.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'My Ledger';

  constructor(private router: Router, private socialService: SocialService) {}

  ngOnInit(): void {
    this.socialService.initAuthListener();
    this.router.events.subscribe((x) => {
      console.log(x);
    });
  }
}
