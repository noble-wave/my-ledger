import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'irs-view',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class IrsViewTemplateComponent implements OnInit {

  @Input() label: string;
  @Input() value: string;

  constructor() { }

  ngOnInit() {
  }

}
