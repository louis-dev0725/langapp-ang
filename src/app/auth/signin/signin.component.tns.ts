import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { ApiError } from '@app/services/api-error';
import { FieldError } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html'
})
export class SigninComponent {
//export class SigninComponent implements OnInit {
  //constructor(private api: ApiService, private custValidator: CustomValidator, private formBuilder: FormBuilder,
  //  private router: Router) {}

  //@Input()
  //set isLoaded(val: boolean) {
  //  this._isLoaded = val;
  //}

  //get isLoaded(): boolean {
  //  return this._isLoaded;
  //}
  //signinForm: FormGroup;
  //errors: FieldError[] = [];

  //private _isLoaded = true;

  //ngOnInit() {
  //  this.signinForm = this.formBuilder.group({
  //    email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
  //    password: ['', { validators: [Validators.required], updateOn: 'change' }]
  //  });
  //}

  //onSubmit(value: any) {
  //  this.errors = [];
  //  this.isLoaded = false;
  //  this.api.login(value).subscribe(res => {
  //    if (res instanceof ApiError) {
  //      this.errors = res.error;
  //      this.isLoaded = true;
  //    } else {
  //      this.router.navigate(['/payment']);
  //
  //      window.postMessage({ type: 'LoginSuccess', text: 'Login'}, '*');
  //    }
  //  });
  //}

  //getErrors(fieldName: string): string {
  //  const errors = this.signinForm.get(fieldName).errors;
  //  const key = Object.keys(errors)[0];
  //  return this.custValidator.errorMap[key] ? this.custValidator.errorMap[key] : '';
  //}

  //checkError(fieldName: string) {
  //  return !!this.signinForm.get(fieldName).errors;
  //}
}
