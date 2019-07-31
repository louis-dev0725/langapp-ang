import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from "@app/pipes/format-date.pipe";
import { FormatNumbersPipe } from "@app/pipes/format-numbers.pipe";
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule } from "@angular/material";

@NgModule({
  declarations: [
    FormatDatePipe,
    FormatNumbersPipe
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  exports: [
    FormatDatePipe,
    FormatNumbersPipe,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class SharedModule { }
