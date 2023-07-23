import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.scss']
})
export class AppNavComponent {
  showFiller: boolean;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public paths = [
    { path: 'institute', label: 'Institute' },
    { path: 'course', label: 'Course' },
    { path: 'academic-year', label: 'Academic Year' },
    { path: 'student/list', label: 'Student' },
  ]

  constructor(private breakpointObserver: BreakpointObserver) { }

}
