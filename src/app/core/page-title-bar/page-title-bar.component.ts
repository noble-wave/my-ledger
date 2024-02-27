import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageTitleBar, IrsPageTitleBarService } from '@app/shared-services';

@Component({
  selector: 'app-page-title-bar',
  templateUrl: './page-title-bar.component.html',
  styleUrls: ['./page-title-bar.component.scss'],
})
export class PageTitleBarComponent implements OnInit {
  pageTitleBar?: IPageTitleBar | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pageTitleBarService: IrsPageTitleBarService
  ) {}

  ngOnInit() {
    this.pageTitleBarService.current$.subscribe((pageTitle) => {
      this.pageTitleBar = pageTitle;
    });
  }

  isSticky() {
    if (this.pageTitleBar?.actions && this.pageTitleBar.actions.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  actionTaken(actionName: string) {
    if (this.pageTitleBar?.actions) {
      const action = this.pageTitleBar.actions.filter(
        (x) => x.actionName === actionName
      )[0];
      if (action?.callback && !action.disabled) {
        action.callback();
      }
    }
  }

  isFaOrGlyphiIcon(icon: string) {
    if (icon && (icon.indexOf('fa') === 0 || icon.indexOf('glyphi') === 0)) {
      return true;
    } else {
      return false;
    }
  }

  isMaterialIcon(icon: string) {
    if (icon) {
      return true;
    } else {
      return false;
    }
  }
}
