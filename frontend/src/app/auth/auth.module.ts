import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninComponent } from '@app/auth/signin/signin.component';
import { SignupComponent } from '@app/auth/signup/signup.component';
import { RestoreComponent } from '@app/auth/restore/restore.component';
import { ApiService } from '@app/services/api.service';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from '@app/auth/auth.component';
import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { StepsModule } from 'primeng/steps';
import { IconModule } from '@visurel/iconify-angular';
import { TreeModule } from 'primeng/tree';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [AuthComponent, SigninComponent, SignupComponent, RestoreComponent],
  imports: [CommonModule, TranslateModule, ReactiveFormsModule, AuthRoutingModule, SharedModule, StepsModule, IconModule, TreeModule, NgxIntlTelInputModule],
  providers: [ApiService],
})
export class AuthModule {}
