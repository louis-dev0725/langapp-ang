import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { RestoreComponent } from './restore/restore.component';
import { ApiService } from '../services/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '@app/auth/auth.component';
import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent, RestoreComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, AuthRoutingModule, SharedModule],
  providers: [ApiService]
})
export class AuthModule {}
