import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {MatSnackBar} from '@angular/material';
import {User} from '../interfaces/common.interface';
import {ReCaptcha2Component} from 'ngx-captcha';
import {CustomValidator} from '../services/custom-validator';
import {SessionService} from '@app/services/session.service';

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

  @ViewChild('frmVar', {static: false}) form;
  @ViewChild('recaptcha', {static: false}) recaptcha: ReCaptcha2Component;

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private session: SessionService
  ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      telephone: [''],
      subject: [''],
      body: ['', {validators: [Validators.required], updateOn: 'change'}],
      recaptcha: ['', Validators.required]
    })
  }

  onSubmit() {
    this.api.sendMessage(this.contactForm.value).subscribe((res) => {
      this.snackBar.open('Your message successfully delivered', null, {duration: 3000} );
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
