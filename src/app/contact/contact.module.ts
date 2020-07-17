import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from '@app/contact/contact.component';
import { ContactRoutingModule } from '@app/contact/contact-routing.module';
import { SharedModule } from '@app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  declarations: [ContactComponent],
  imports: [FormsModule, ReactiveFormsModule, TranslateModule, NgxCaptchaModule, CommonModule, ContactRoutingModule,
    SharedModule]
})
export class ContactModule {}
