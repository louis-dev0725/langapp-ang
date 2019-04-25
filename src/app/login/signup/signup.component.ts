import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../services/api.service";
import {TranslateService} from "@ngx-translate/core";

import * as jstz from 'jstz';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  private errorMap = {
    required: 'This field is required',
    email: 'This is not valid email',
    passconfirm: 'Password and repeat password are not equals'
  };

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
    }, {validator: SignupComponent.confirmPasswordCheck})
  }

  getTimezone() {
    const tz = jstz.determine();
    return tz.name();
  }

  getLanguage() {

  }

  getInvatedId(): string | boolean {
    const val = localStorage.getItem('invitedByUserId');
    return (val) ? val : false;
  }

  onSubmit(value: any) {

  }

  /**
   * this method used as a custom validator to check
   * the password and repeat-password is equaled or not
   * @param ctrl
   */
  static confirmPasswordCheck(ctrl: AbstractControl) {
    const password = ctrl.get('password').value;
    const passrepeat = ctrl.get('passrepeat').value;
    if (password !== passrepeat) {
      ctrl.get('passrepeat').setErrors({passconfirm: true});
    } else {
      return null;
    }
  }

  getErrors(fieldName: string): string {
    const errors = this.signupForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.errorMap[key]) ? this.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    return !!this.signupForm.get(fieldName).errors
  }
}
