import {Component, OnInit} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@app/interfaces/common.interface';
import {CustomValidator} from '@app/services/custom-validator';
import {ApiError} from '@app/services/api-error';
import {MatSnackBar} from '@angular/material';
import {SessionService} from '@app/services/session.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;
  isChangePassword = false;
  timeZones: any[] = [];

  private _errors = [];
  get errors() {
    return this._errors;
  };

  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  get user(): User {
    return this.session.user;
  }

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private session: SessionService) {
  }

  ngOnInit() {

    this.api.getTimeZones().subscribe((res: any) => {
      this.timeZones = res;
    });

    this.settingsForm = this.formBuilder.group({
      id: [this.user['id'] || ''],
      name: [this.user['name'] || '', {validators: [Validators.required], updateOn: 'change'}],
      email: [this.user['email'] || '', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      company: [this.user['company'] || ''],
      site: [this.user['site'] || ''],
      telephone: [this.user['telephone'] || ''],
      isServicePaused: [''],
      wmr: [this.user['wmr'] || ''],
      timezone: [''],
      language: ['']
    });

  }

  checkError(fieldName: string) {
    return !this.settingsForm.get(fieldName).valid
  }

  getError(fieldName: string) {
    const errors = this.settingsForm.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.settingsForm.addControl('password', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
      this.settingsForm.addControl('passrepeat', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
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
    this.api.updateUser(value).subscribe((result) => {
      if (result instanceof ApiError) {
        this._errors = result.error;
      } else {
        this.session.user = result;
        this.snackBar.open(this.customValidator.messagesMap['snackbar.settings-edit-success'],  null,{duration: 3000});
      }
    })
  }
}
