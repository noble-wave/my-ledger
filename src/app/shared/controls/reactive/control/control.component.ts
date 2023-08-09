import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IrsControl, ModelMeta } from '@app/shared-services';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class IrsControlComponent implements OnInit {

  @Input() meta!: ModelMeta;
  @Input() form!: FormGroup;
  @Output() onValueChange = new EventEmitter<any>(true);

  control!: IrsControl;
  hideRequiredMarker = false;
  isMatInput: boolean;

  constructor() { }

  ngOnInit() {
    // Default type is text
    this.meta.controlType = this.meta.controlType || 'text';

    this.isMatInput = this.meta.controlType == 'radio' ? false : true;

    this.control = this.form.get(this.meta.key) as IrsControl;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.control = this.form.get(this.meta.key) as IrsControl;
    }
  }

  valueChange(value) {
    // console.log(event);
    this.onValueChange.emit(value);
  }

}