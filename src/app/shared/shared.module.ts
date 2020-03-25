import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from '@app/pipes/format-date.pipe';
import { FormatNumbersPipe } from '@app/pipes/format-numbers.pipe';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule,
  MatProgressSpinnerModule, MatSelectModule } from '@angular/material';
import { RoundToPipe } from '@app/pipes/round-to.pipe';
import { FormatCurrencyPipe } from '@app/pipes/format-currency.pipe';

@NgModule({
  declarations: [FormatDatePipe, FormatNumbersPipe, RoundToPipe, FormatCurrencyPipe],
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ],
  exports: [
    FormatDatePipe,
    FormatNumbersPipe,
    RoundToPipe,
    FormatCurrencyPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule
  ]
})
export class SharedModule {}
