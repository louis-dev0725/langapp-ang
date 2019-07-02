import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from "@app/pipes/format-date.pipe";
import { FormatNumbersPipe } from "@app/pipes/format-numbers.pipe";

@NgModule({
  declarations: [
    FormatDatePipe,
    FormatNumbersPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatDatePipe,
    FormatNumbersPipe
  ]
})
export class SharedModule { }
