import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule, MatCardModule, MatCheckboxModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule, Routes} from '@angular/router';
import { AdmUsersComponent } from './adm-users/adm-users.component';
import {FlexModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AdmUserEditComponent } from './adm-user-edit/adm-user-edit.component';

const routes: Routes = [
  {
    path: 'users',
    component: AdmUsersComponent
  },
  {
    path: 'user',
    component: AdmUserEditComponent
  }
];

@NgModule({
  declarations: [AdmUsersComponent, AdmUserEditComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    FlexModule,
    MatInputModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSelectModule
  ]
})
export class AdminModule { }
