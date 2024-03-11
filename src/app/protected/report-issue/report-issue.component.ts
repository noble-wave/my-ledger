import { Component } from '@angular/core';

@Component({
  selector: 'app-report-issue',
  templateUrl: './report-issue.component.html',
  styleUrls: ['./report-issue.component.scss'],
})
export class ReportIssueComponent {
  constructor() {}

  ngOnInit(): void {}

  resizeIframe(event: any) {
    event.currentTarget.style.height =
      event.currentTarget.contentWindow.document.documentElement.scrollHeight +
      'px';
  }
}
