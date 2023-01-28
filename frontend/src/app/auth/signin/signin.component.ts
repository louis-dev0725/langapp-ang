import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: UntypedFormBuilder, private router: Router) {}

  signinForm: UntypedFormGroup;
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
      if (res instanceof ApiError) {
        this.errors = res.error;
        this.isLoaded = true;
      } else {
        this.router.navigate(['/content/materials']);

        window.postMessage({ type: 'LoginSuccess', text: 'Login' }, '*');
      }
    });
  }

  getErrors(fieldName: string): string {
    return this.customValidator.getErrors(this.signinForm, fieldName);
  }

  checkError(fieldName: string) {
    let field = this.signinForm.get(fieldName);
    return (field.touched || field.dirty) && !field.valid;
  }
}
