import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
// import {MatOptionModule} from '@angular/material/';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTreeModule } from '@angular/material/tree';


import { IrsInputComponent } from './controls/reactive/input/input.component';
import { AppSelectComponent } from './controls/reactive/select/select.component';
import { IrsTableComponent } from './controls/reactive/table/table.component';
import { IrsToggleComponent } from './controls/reactive/toggle/toggle.component';
import { IrsCheckboxComponent } from './controls/reactive/checkbox/checkbox.component';
import { IrsTypeaheadComponent } from './controls/reactive/typeahead/typeahead.component';
import { AppDateComponent } from './controls/reactive/date/date.component';


import { IrsSearchTemplateComponent } from './controls/template/search-template/search-template.component';
import { IrsInputTemplateComponent } from './controls/template/input-template/input-template.component';
import { IrsAlertComponent } from './widgets/alert/alert.component';
import { IrsConfirmComponent } from './widgets/confirm/confirm.component';
import { IrsRadioComponent } from './controls/reactive/radio/radio.component';
import { IrsViewTemplateComponent } from './controls/template/view-template/view-template.component';
import { IrsIndexComponent } from './controls/template/index-template/index-template.component';
import { SharedServicesModule } from '../shared-services/shared-services.module';
import { IrsErrorComponent } from './controls/reactive/error/error.component';
import { IrsLocalTableComponent } from './controls/template/local-search-table/local-table.component';
import { ColumnOptionsDailogComponent } from './controls/template/local-search-table/column-options-dailog/column-options-dailog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LetDirective } from './directives/let.directive';
import { IrsControlComponent } from './controls/reactive/control/control.component';
import { DialogComponent } from './controls/template/dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedServicesModule,

    MatNativeDateModule, MatRippleModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule,
    MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule,
    MatTabsModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatAutocompleteModule, MatDatepickerModule,
    MatTooltipModule, MatStepperModule, MatTreeModule, DragDropModule,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    SharedServicesModule,

    MatNativeDateModule, MatRippleModule,
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatGridListModule,
    MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule,
    MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule,
    MatTabsModule, MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatAutocompleteModule, MatDatepickerModule,
    MatTooltipModule, MatStepperModule, MatTreeModule, DragDropModule,

    LetDirective,

    IrsInputComponent, AppSelectComponent, IrsTableComponent, IrsToggleComponent, IrsCheckboxComponent, IrsTypeaheadComponent,
    AppDateComponent, IrsRadioComponent, IrsLocalTableComponent, IrsControlComponent,

    IrsSearchTemplateComponent, IrsInputTemplateComponent,

    IrsViewTemplateComponent, IrsIndexComponent,
  ],
  declarations: [
    LetDirective,

    IrsInputComponent, AppSelectComponent, IrsTableComponent, IrsToggleComponent, IrsCheckboxComponent, IrsTypeaheadComponent,
    AppDateComponent, IrsRadioComponent, IrsLocalTableComponent,

    IrsSearchTemplateComponent, IrsInputTemplateComponent, IrsAlertComponent, IrsConfirmComponent,

    IrsViewTemplateComponent, IrsIndexComponent, IrsErrorComponent, ColumnOptionsDailogComponent, IrsControlComponent, DialogComponent,]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        MatDatepickerModule,
      ]
    };
  }

}
