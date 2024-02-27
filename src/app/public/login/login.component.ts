import { Component, OnInit } from '@angular/core';
import { SocialUser } from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { SocialService } from '@app/services/social.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  user?: SocialUser;
  loggedIn: boolean;

  constructor(private socialService: SocialService, private router: Router) {}

  ngOnInit() {
    this.socialService.$userData.subscribe((user) => {
      if (user) {
        this.user = user;
        this.loggedIn = user != null;
        this.router.navigate(['/product'], {});
      }
    });
  }

  signOut(): void {
    this.socialService.signOut();
  }

  withoutLogin() {
    this.router.navigate(['/product'], {});
  }
}
