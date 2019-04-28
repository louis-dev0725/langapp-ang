import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersComponent} from './users.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    MatFormFieldModule
  ]
})
export class UsersModule { }
