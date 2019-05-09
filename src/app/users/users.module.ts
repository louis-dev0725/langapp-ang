import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UsersComponent} from './users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule} from '@angular/router';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    UsersComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule
  ]
})
export class UsersModule { }
