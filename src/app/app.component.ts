import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'My Ledger';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((x) => {
      console.log(x);
    });
  }
}
