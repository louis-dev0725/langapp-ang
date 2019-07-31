import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SettingsComponent } from './settings/settings.component';
import { UsersRoutingModule } from "@app/users/users-routing.module";
import { SharedModule } from "@app/shared/shared.module";

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
    FormsModule,
    UsersRoutingModule,
    SharedModule
  ]
})
export class UsersModule {
}
