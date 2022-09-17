import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { ApiError } from '@app/services/api-error';
import { FieldError } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  constructor(private api: ApiService, private custValidator: CustomValidator, private formBuilder: FormBuilder, private router: Router) {}

  signinForm: FormGroup;
  errors: FieldError[] = [];

  isLoaded = true;

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'blur' }],
      password: ['', { validators: [Validators.required], updateOn: 'change' }],
    });
  }

  onSubmit() {
    this.errors = [];
    this.isLoaded = false;
    this.api.login(this.signinForm.value).subscribe((res) => {
      console.log('res in signin', res);
      if (res instanceof ApiError) {
        this.errors = res.error;
        this.isLoaded = true;
      } else {
        this.router.navigate(['/']);

        window.postMessage({ type: 'LoginSuccess', text: 'Login' }, '*');
      }
    });
  }

  getErrors(fieldName: string): string {
    const errors = this.signinForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.custValidator.errorMap[key] ? this.custValidator.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    let field = this.signinForm.get(fieldName);
    return (field.touched || field.dirty) && !field.valid;
  }
}
