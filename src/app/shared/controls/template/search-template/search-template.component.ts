import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'irs-search-template',
  templateUrl: './search-template.component.html',
  styleUrls: ['./search-template.component.scss']
})
export class IrsSearchTemplateComponent implements OnInit {

  @Input() searchWord: string;

  @Output() searched = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  onSearch() {
    this.searched.emit(this.searchWord);
  }
}
