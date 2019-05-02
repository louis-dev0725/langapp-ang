import { NgModule } from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import { AboutComponent } from './about/about.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  providers: [DecimalPipe]
})
export class PartnersModule { }
