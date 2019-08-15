import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/interfaces/common.interface';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { MatSnackBar } from '@angular/material';
import { SessionService } from '@app/services/session.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  isChangePassword = false;
  timeZones: any[] = [];
  user;

  private _errors = [];
  get errors() {
    return this._errors;
  }

  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private session: SessionService
  ) {}

  ngOnInit() {
    this.api.meRequest()
    .pipe(untilDestroyed(this))
    .subscribe(res => {
      this.user = res;
      this.settingsForm.patchValue({
        id: res.id,
        name: res.name,
        email: res.email,
        company: res.company,
        site: res.site,
        telephone: res.telephone,
        wmr: res.wmr
      });
    });


    this.api.getTimeZones()
    .pipe(untilDestroyed(this))
    .subscribe((res: any) => {
      this.timeZones = res;
    });

    this.settingsForm = this.formBuilder.group({
      id: [''],
      name: ['', { validators: [Validators.required], updateOn: 'change' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
      company: [''],
      site: [''],
      telephone: [''],
      isServicePaused: [''],
      wmr: [''],
      timezone: [''],
      language: ['']
    });
  }

  ngOnDestroy() {}

  checkError(fieldName: string) {
    return !this.settingsForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    const errors = this.settingsForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return this.customValidator.errorMap[key] ? this.customValidator.errorMap[key] : '';
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.settingsForm.addControl(
        'password',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      );
      this.settingsForm.addControl(
        'passrepeat',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change'
        })
      );
      this.settingsForm.setValidators([CustomValidator.confirmPasswordCheck]);
      this.settingsForm.updateValueAndValidity();
    } else {
      this.settingsForm.clearValidators();
      this.settingsForm.updateValueAndValidity();
      this.settingsForm.removeControl('password');
      this.settingsForm.removeControl('passrepeat');
    }
  }

  onSubmit(value: any) {
    this.api.updateUser(value)
    .pipe(untilDestroyed(this))
    .subscribe(result => {
      if (result instanceof ApiError) {
        this._errors = result.error;
      } else {
        this.session.user = result;
        this.snackBar.open(this.customValidator.messagesMap['snackbar.settings-edit-success'], null, { duration: 3000 });
      }
    });
  }
}
