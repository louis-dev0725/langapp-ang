import {Component, OnInit} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@app/interfaces/common.interface';
import {MatSnackBar} from '@angular/material';
import {CustomValidator} from '@app/services/custom-validator';
import {SessionService} from '@app/services/session.service';

@Component({
  selector: 'app-adm-user-edit',
  templateUrl: './adm-user-edit.component.html',
  styleUrls: ['./adm-user-edit.component.scss']
})
export class AdmUserEditComponent implements OnInit {

  private _errors = [];

  isChangePassword = false;
  userProfile: FormGroup;
  user: User;
  timeZones: any[] = [];

  get errors() {
    return this._errors;
  };

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private formBuilder: FormBuilder,
    private session: SessionService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.user = this.session.userToEdit;

    this.api.getTimeZones().subscribe((res: any) => {
      this.timeZones = res;
    });

    this.userProfile = this.formBuilder.group({
      id: [''],
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      company: [''],
      site: [''],
      telephone: [''],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      isServicePaused: [''],
      balance: [''],
      balancePartner: [''],
      wmr: [''],
      registerIp: [''],
      lastLoginIp: [''],
      timezone: [''],
      language: ['']
    })
  }

  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  checkError(fieldName: string) {
    return !this.userProfile.get(fieldName).valid
  }

  getError(fieldName: string) {
    const errors = this.userProfile.get(fieldName).errors;
    const key = Object.keys(errors)[0];
    return (this.customValidator.errorMap[key]) ? this.customValidator.errorMap[key] : '';
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.userProfile.addControl('password', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
      this.userProfile.addControl('passrepeat', this.formBuilder.control('', {
        validators: [Validators.required],
        updateOn: 'change'
      }));
      this.userProfile.setValidators([CustomValidator.confirmPasswordCheck]);
      this.userProfile.updateValueAndValidity();
    } else {
      this.userProfile.clearValidators();
      this.userProfile.updateValueAndValidity();
      this.userProfile.removeControl('password');
      this.userProfile.removeControl('passrepeat');
    }
  }
}
