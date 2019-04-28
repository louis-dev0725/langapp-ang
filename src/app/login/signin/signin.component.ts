import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor(
    private api: ApiService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.signinForm = this.formBuilder.group({
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      password: ['', {validators: [Validators.required], updateOn: 'change'}]
    })
  }

  onSubmit(value: any) {
    this.api.login(value).subscribe((res) => {
      if (res) {
        // note: [SHR] place here default route
        this.router.navigate(['/payment'])
      }
    });
  }

  checkError(fieldName: string) {
    return !this.signinForm.valid;
  }

  getError(fieldName: string) {
    return this[fieldName + 'Errors']();
  }

  private emailErrors(): string {
    // todo: [SHR]: translate errors
    const eml = this.signinForm.get('email');
    return eml.hasError('required') ? 'Field is required' :
      eml.hasError('email') ? 'Not a valid email' : '';
  }

  private passwordErrors(): string {
    // todo: [SHR]: translate errors
    const pwd = this.signinForm.get('password');
    return pwd.hasError('required') ? 'Field is required' : '';
  }
}
