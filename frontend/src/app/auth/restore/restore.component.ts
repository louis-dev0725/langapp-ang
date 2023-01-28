import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from '@app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss'],
})
export class RestoreComponent implements OnInit {
  readonly MODE_REQUEST = 'request-link';
  readonly MODE_REQUEST_SENT = 'request-sent';
  readonly MODE_PASSWORD = 'password-change';

  restoreForm: UntypedFormGroup = new UntypedFormGroup({});
  _mode = this.MODE_REQUEST;
  errors: any[] = [];
  get mode(): string {
    return this._mode;
  }

  set mode(val: string) {
    if (this.mode !== val) {
      this._mode = val;
      this.changeForm();
    }
  }

  constructor(private activatedRoute: ActivatedRoute, private customValidator: CustomValidator, private api: ApiService, private router: Router) {
    if (this.activatedRoute.snapshot.data.mode) {
      this.mode = activatedRoute.snapshot.data.mode;
    }
  }

  ngOnInit() {
    // todo: [SHR]: translate errors
    this.changeForm();
  }

  changeForm() {
    if (this.mode === this.MODE_REQUEST) {
      this.restoreForm = new UntypedFormGroup({
        email: new UntypedFormControl('', { validators: [Validators.required, Validators.email], updateOn: 'change' }),
      });
    }

    if (this.mode === this.MODE_PASSWORD) {
      this.restoreForm = new UntypedFormGroup(
        {
          password: new UntypedFormControl('', { validators: [Validators.required], updateOn: 'change' }),
          passrepeat: new UntypedFormControl('', { validators: [Validators.required], updateOn: 'change' }),
        },
        CustomValidator.confirmPasswordCheck
      );
    }
  }

  checkError(fieldName: string) {
    return !!this.restoreForm.get(fieldName).errors;
  }

  getErrors(fieldName: string): string {
    return this.customValidator.getErrors(this.restoreForm, fieldName);
  }

  onSubmit() {
    this.errors = [];
    if (this.mode === this.MODE_REQUEST) {
      this.api.restorePasswordRequest(this.restoreForm.value).subscribe((res) => {
        if (res instanceof ApiError) {
          this.mode = this.MODE_REQUEST;
          this.errors = res.error;
        }
      });
      this.mode = this.MODE_REQUEST_SENT;
    }

    if (this.mode === this.MODE_PASSWORD) {
      this.api.changePassword(this.restoreForm.value).subscribe((res) => {
        this.router.navigate(['/payment']);
      });
    }
  }
}
