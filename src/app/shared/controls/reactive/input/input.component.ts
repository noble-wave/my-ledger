import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { IrsControl } from '@shared-services';

@Component({
  selector: 'irs-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class IrsInputComponent implements OnInit, OnChanges {

  @Input() form: AbstractControl; // FormGroup;
  @Input() name: string;
  @Input() label: string;
  @Input() type: string;
  @Input() icon: string;
  @Input() hint: string;
  @Input() hintEnd: string;

  control!: IrsControl;
  hideRequiredMarker = false;

  constructor() { }

  ngOnInit() {
    // Default type is text
    if (!this.type) {
      this.type = 'text';
    }

    this.control = this.form.get(this.name) as IrsControl;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['form']) {
      this.control = this.form.get(this.name) as IrsControl;
    }
  }

}

