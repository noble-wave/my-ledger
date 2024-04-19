import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormControl, AbstractControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { FloatLabelType } from '@angular/material/form-field';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

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
  @Input() suffixActionIcon: string | boolean;
  control: FormControl;
  isRequired: boolean;
  private searchUpdated = new Subject<string>();
  @Output() public debounceKeyup = new EventEmitter<string>();
  @Output() onSelectionChange = new EventEmitter<any>(true);
  @Output() navigateClick: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(MatAutocompleteTrigger, { static: true })
  trigger: MatAutocompleteTrigger;

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

    // this.filteredOptions = this.control.valueChanges.pipe(
    //   startWith(''),
    //   map((x) => (x ? this._filter(x) : this.options?.slice() || []))
    // );

    // Autocomplete
    this.searchUpdated
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((x: string) => {
        console.log(x);
        this.debounceKeyup.emit(x);
      });
  }

  onKeyup(event?: any) {
    let searchTxt = event?.target?.value;
    console.log('user Input:', searchTxt);
    this.filteredOptions = this._filter(searchTxt);
    this.control.setValue(null);
    this.searchUpdated.next(searchTxt);
  }

  private _filter(value: string): any[] {
    if (value && this.options) {
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

  selectionChange(option: MatAutocompleteSelectedEvent) {
    console.log(option);
    let selctedOption =
      this.options &&
      this.options.find((x) => x[this.optValueLabel] === option.option.value);
    if (selctedOption) {
      this.viewValue = selctedOption[this.optTextLabel];
      this.control.setValue(selctedOption[this.optValueLabel]);
      this.onSelectionChange.emit(selctedOption);
    }
  }

  displayWith = (value: string) => {
    let option =
      this.options && this.options.find((x) => x[this.optValueLabel] === value);
    return option && option[this.optTextLabel];
  };

  onActionIconClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (this.control.value) {
      this.navigateClick.emit();
    }
  }

  onClick(trigger: MatAutocompleteTrigger): void {
    trigger.openPanel();
  }
}
