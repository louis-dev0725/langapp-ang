import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';

import * as jstz from 'jstz';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { SessionService } from '@app/services/session.service';
import { allParams } from '@app/shared/helpers';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  errors: any[] = [];
  quickSignup = true;

  constructor(
    private api: ApiService,
    private custValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        //timezone: [this.getTimezone() || ''],
        //language: [this.getLanguage() || ''],
        //invitedByUserId: [this.getInvitedByUserId() || ''],
        name: ['', { validators: [Validators.required], updateOn: 'change' }],
        //company: [''],
        //telephone: [''],
        email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
        password: ['', { validators: [Validators.required], updateOn: 'change' }],
        passrepeat: ['', { validators: this.quickSignup ? [] : [Validators.required], updateOn: 'change' }]
      },
      {
        validators: this.quickSignup ? [] : [
          CustomValidator.confirmPasswordCheck
        ]
      }
    );
    this.route.queryParams.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params['email']) {
        this.signupForm.get('email').setValue(params['email'])
      }
    });
  }

  getTimezone() {
    const tz = jstz.determine();
    return tz.name();
  }

  getLanguage() {
    return this.sessionService.language;
  }

  getInvitedByUserId(): number {
    const val = parseInt(this.cookieService.get('invitedByUserId'));
    return val;
  }

  onSubmit() {
    this.errors = [];
    const data = {
      ...this.signupForm.value,
      invitedByUserId: this.getInvitedByUserId(),
      language: this.getLanguage(),
      timezone: this.getTimezone(),
    };
    this.api.signUp(data).subscribe(res => {
      if (res instanceof ApiError) {
        this.errors = res.error;
      } else {
        this.router.navigate(['/payment']);

        window.postMessage({ type: 'LoginSuccess', text: 'Login' }, '*');
      }
    });
  }

  getErrors(fieldName: string): string {
    const errors = this.signupForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.custValidator.errorMap[key] ? this.custValidator.errorMap[key] : '';
  }

  checkError(fieldName: string) {
    let field = this.signupForm.get(fieldName);
    return (field.touched || field.dirty) && !field.valid;
  }
}
