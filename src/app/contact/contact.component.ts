import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatSnackBar } from '@angular/material';
import { User } from '../interfaces/common.interface';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CustomValidator } from '../services/custom-validator';
import { SessionService } from '@app/services/session.service';
import { TranslatingService } from "@app/services/translating.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  get isErrors() {
    return !this.contactForm.valid;
  }

  get language(): string {
    return localStorage.getItem('lang');
  }

  get user(): User {
    return this.session.user;
  }

  @ViewChild('frmVar', {static: true}) form;
  @ViewChild('recaptcha', {static: true}) recaptcha: ReCaptcha2Component;

  constructor(
    private translatingService: TranslatingService,
    public api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private session: SessionService
  ) {
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: [this.user['name'] || '', {validators: [Validators.required], updateOn: 'change'}],
      email: [this.user['email'] || '', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      telephone: [this.user['telephone'] || ''],
      body: ['', {validators: [Validators.required], updateOn: 'change'}],
      recaptcha: ['', Validators.required]
    })
  }

  onSubmit() {
    this.api.sendMessage(this.contactForm.value).subscribe((res) => {
      this.snackBar.open(this.translatingService.translates['Messages sent'], null, {duration: 3000});
      this.form.resetForm();
      this.contactForm.get('name').setValue(this.user.name);
      this.contactForm.get('email').setValue(this.user.email);
      this.contactForm.get('telephone').setValue(this.user.telephone);
    }, (err) => {
      this.contactForm.reset(this.contactForm.value);
    });
    this.reloadCaptcha();
  }

  checkError(fieldName: string) {
    return !this.contactForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.contactForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  resetCaptcha() {
    this.recaptcha.resetCaptcha();
  }

  reloadCaptcha() {
    this.recaptcha.reloadCaptcha();
  }
}
