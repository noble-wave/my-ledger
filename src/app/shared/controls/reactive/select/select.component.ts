import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { IrsControl } from '@shared-services';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
})
export class AppSelectComponent implements OnInit, OnChanges {
  @Input() form: AbstractControl; // FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() isDisabled: boolean;
  @Input() options: any;
  @Input() optTextLabel: string = 'value';
  @Input() optValueLabel: string = 'key';
  @Input() hide: boolean;
  @Output() onSelectionChange = new EventEmitter<any>(true);

  control: IrsControl;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.control = this.form.get(this.name) as IrsControl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.control = this.form.get(this.name) as IrsControl;
    }
    this.cdRef.markForCheck();
  }

  selectionChange(event) {
    let option = this.options.find((x) => x[this.optValueLabel] == event.value);
    this.onSelectionChange.emit(option);
  }
}
