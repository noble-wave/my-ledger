import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'irs-input-template',
  templateUrl: './input-template.component.html',
  styleUrls: ['./input-template.component.scss']
})
export class IrsInputTemplateComponent implements OnInit {

  @Input() model: any;
  @Input() bindingPropertyName: string;
  @Input() label: string;
  @Input() type = 'text';

  @Input() viewOnly = false;

  // icon and its position
  @Input() icon?: string = undefined;
  @Input() iconAtStart = true;
  // is input required validation
  @Input() isRequired = false;
  @Output() textChanged = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  changed() {
    this.textChanged.emit(true);
  }

}
