import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '@app/services/api.service';
import {Router} from '@angular/router';
import {ApiError} from '@app/services/api-error';
import {FieldError} from '@app/interfaces/common.interface';
import {CustomValidator} from '@app/services/custom-validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  errors: FieldError[] = [];

  constructor(
    private api: ApiService,
    private custValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private router: Router) {
  }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      password: ['', {validators: [Validators.required], updateOn: 'change'}]
    })
  }

  onSubmit(value: any) {
    this.errors = [];
    this.api.login(value).subscribe((res) => {
      if (res instanceof ApiError) {

        this.errors = res.error;
      } else {
        // note: [SHR] place here default route
        this.router.navigate(['/payment'])
      }
    });
  }

  getErrors(fieldName: string): string {
    const errors = this.signinForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.custValidator.errorMap[key]) ? this.custValidator.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    return !!this.signinForm.get(fieldName).errors
  }
}
