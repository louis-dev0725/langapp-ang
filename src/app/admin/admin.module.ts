import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import {TranslateModule} from '@ngx-translate/core';
import {RouterModule, Routes} from '@angular/router';
import { AdmUsersComponent } from './adm-users/adm-users.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import {FlexModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: 'users',
    component: AdmUsersComponent
  }
];

@NgModule({
  declarations: [AdmUsersComponent, EditUserComponent],
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
    FormsModule
  ]
})
export class AdminModule { }
