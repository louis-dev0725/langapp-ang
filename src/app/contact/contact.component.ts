import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {MatSnackBar} from '@angular/material';
import {User} from '../interfaces/common.interface';
import {ReCaptcha2Component} from 'ngx-captcha';

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
    return this.api.user;
  }

  @ViewChild('recaptcha') recaptcha: ReCaptcha2Component;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private snakcBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      telephone: [''],
      message: ['', {validators: [Validators.required], updateOn: 'change'}],
      recaptcha: ['', Validators.required]
    })
  }

  onSubmit(data: any) {
    this.api.sendMessage(data).subscribe((res) => {
      this.contactForm.reset();
      this.snakcBar.open('Your message successfully delivered' )
    }, () => {
      this.contactForm.reset(data);
    })
  }

  checkError(fieldName: string) {
    return !this.contactForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.contactForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
  }

  resetCaptcha() {
    this.recaptcha.resetCaptcha();
  }

  reloadCaptcha() {
    this.recaptcha.reloadCaptcha();
  }
}
