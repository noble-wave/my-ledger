import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'irs-error',
  templateUrl: './error.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class IrsErrorComponent implements OnInit {

  @Input() control: FormControl;

  constructor() { }

  ngOnInit(): void {
  }

}
