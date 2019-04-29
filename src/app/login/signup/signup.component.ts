import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {TranslateService} from '@ngx-translate/core';

import * as jstz from 'jstz';
import {CustomValidator} from "../../services/custom-validator";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private translate: TranslateService) {
  }

  ngOnInit() {

    // todo: [SHR]: translate errors

    this.signupForm = this.formBuilder.group({
      timezone: [''],
      language: [''],
      invitedByUserId: [''],
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      company: [''],
      telephone: [''],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      password: ['', {validators: [Validators.required], updateOn: 'change'}],
      passrepeat: ['', {validators: [Validators.required], updateOn: 'change'}],
    }, {validator: CustomValidator.confirmPasswordCheck})
  }

  getTimezone() {
    const tz = jstz.determine();
    return tz.name();
  }

  getLanguage() {
    return navigator.language;
  }

  getInvatedId(): string | boolean {
    const val = localStorage.getItem('invitedByUserId');
    return (val) ? val : false;
  }

  onSubmit(value: any) {
    this.api.signUp(value).subscribe((res) => {
      console.log('result', res);
    })
  }


  getErrors(fieldName: string): string {
    const errors = this.signupForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (CustomValidator.errorMap[key]) ? CustomValidator.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    return !!this.signupForm.get(fieldName).errors
  }
}
