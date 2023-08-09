import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { IDropdownOption } from '@shared-services';

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss']
})
export class IrsRadioComponent implements OnInit {

  @Input() form: FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() showInputValidationMessages: boolean;
  @Input() tooltiptext: string;

  @Input() options: Array<IDropdownOption> | Array<any>;
  @Input() optionValueField = 'Value';
  @Input() optionTextField = 'Text';

  control: FormControl;
  isRequired: boolean;

  constructor() { }

  ngOnInit() {
    this.control = this.form.get(this.name) as FormControl;
  }

}
