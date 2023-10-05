import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
})
export class IrsTypeaheadComponent implements OnInit {
  @Input() form: AbstractControl;
  @Input() name: string;
  @Input() label: string;
  @Input() type: string;
  @Input() showInputValidationMessages: boolean;
  @Input() tooltiptext: string;
  @Input() icon: string;
  @Input() isDisabled: boolean;
  @Input() floatLabel: FloatLabelType;
  @Input() options: any[];
  @Input() viewValue: string;
  @Input() optTextLabel: string = 'value';
  @Input() optValueLabel: string = 'key';
  control: FormControl;
  isRequired: boolean;
  private searchUpdated = new Subject();
  @Output() public debounceKeyup = new EventEmitter<string>();
  @Output() onSelectionChange = new EventEmitter<any>(true);
  filteredOptions: any[];

  constructor() {}

  ngOnInit() {
    if (!this.viewValue) {
      this.viewValue = '';
    }

    this.control = this.form.get(this.name) as FormControl;
    if (this.control && this.control.validator) {
      const validator = this.control.validator(new FormControl());
      this.isRequired = validator && validator['required'] ? true : false;
    }

    // Default float type Auto
    if (this.floatLabel) {
      this.floatLabel = 'auto';
    }

    this.onKeyup();

    // Autocomplete
    // this.searchUpdated.debounceTime(100).distinctUntilChanged()
    // .subscribe((x: string) => { console.log(x); this.debounceKeyup.emit(x); });
  }

  onKeyup(event?: any) {
    let searchTxt = event?.target?.value;
    this.filteredOptions = this._filter(searchTxt);
    this.searchUpdated.next(searchTxt);
  }

  private _filter(value: string): any[] {
    if (value) {
      const filterValue = value.toLowerCase();
      return this.options.filter((x) =>
        x[this.optTextLabel].toLowerCase().includes(filterValue)
      );
    } else {
      return [];
    }
  }

  // Deprecated
  onSelection(option) {
    this.control.setValue(option.value);
  }

  selectionChange(option) {
    // console.log(event);
    // let option = this.options.find(x => x[this.optValueLabel] == event.value);
    this.viewValue = option[this.optTextLabel];
    this.onSelectionChange.emit(option);
  }
}
