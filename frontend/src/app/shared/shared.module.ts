import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { FormatNumbersPipe } from '@app/pipes/format-numbers.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RoundToPipe } from '@app/pipes/round-to.pipe';
import { FormatCurrencyPipe } from '@app/pipes/format-currency.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
import { SlideMenuModule } from 'primeng/slidemenu';
import { PaginatorModule } from 'primeng/paginator';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OnclickTranslationDirective } from './onclick-translation.directive';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToolbarModule } from 'primeng/toolbar';

let sharedModules = [
  // primeng
  InputTextModule,
  InputTextareaModule,
  ButtonModule,
  MessagesModule,
  MessageModule,
  DropdownModule,
  ToggleButtonModule,
  ProgressSpinnerModule,
  BadgeModule,
  SlideMenuModule,
  PaginatorModule,
  ChipModule,
  ToastModule,
  TagModule,
  TableModule,
  DividerModule,
  CheckboxModule,
  ConfirmPopupModule,
  MultiSelectModule,
  ToolbarModule,

  // material
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCardModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatTableModule,
  MatPaginatorModule,
  MatRadioModule
];

@NgModule({
  declarations: [
    FormatDatePipe,
    FormatNumbersPipe,
    RoundToPipe,
    FormatCurrencyPipe,
    OnclickTranslationDirective
  ],
  imports: [
    CommonModule,
    ...sharedModules
  ],
  exports: [
    FormatDatePipe,
    FormatNumbersPipe,
    RoundToPipe,
    FormatCurrencyPipe,
    OnclickTranslationDirective,
    ...sharedModules
  ]
})
export class SharedModule { }
