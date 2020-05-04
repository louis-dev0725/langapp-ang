import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from '@src/app/auth/signin/signin.component';
import { SignupComponent } from '@src/app/auth/signup/signup.component';
import { RestoreComponent } from '@src/app/auth/restore/restore.component';
import { ApiService } from '@src/app/services/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '@src/app/auth/auth.component';
import { AuthRoutingModule } from '@src/app/auth/auth-routing.module';
import { SharedModule } from '@src/app/shared/shared.module';

@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent, RestoreComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, AuthRoutingModule, SharedModule],
  providers: [ApiService]
})
export class AuthModule {}
