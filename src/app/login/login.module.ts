import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SigninComponent} from "./signin/signin.component";
import { SignupComponent } from './signup/signup.component';
import { RestoreComponent } from './restore/restore.component';
import {ApiService} from "../services/api.service";
import {TranslateModule} from "@ngx-translate/core";
import {MatButtonModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";

@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    RestoreComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule
  ],
  providers: [ApiService]
})
export class LoginModule { }
