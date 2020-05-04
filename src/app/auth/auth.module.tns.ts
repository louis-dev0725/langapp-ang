import { NgModule } from '@angular/core';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';

import { AuthComponent } from '@app/auth/auth.component';
import { SigninComponent } from '@app/auth/signin/signin.component.tns';
//import { SignupComponent } from '@app/auth/signup/signup.component.tns';
//import { RestoreComponent } from '@app/auth/restore/restore.component.tns';
import { AuthRoutingModule } from '@app/auth/auth-routing.module.tns';
import { ApiService } from '@app/services/api.service';

@NgModule({
  declarations: [AuthComponent, SigninComponent],
  //declarations: [AuthComponent, SigninComponent, SignupComponent, RestoreComponent],
  imports: [NativeScriptCommonModule, TranslateModule, NativeScriptFormsModule, AuthRoutingModule, SharedModule],
  providers: [ApiService]
})
export class AuthModule {}
