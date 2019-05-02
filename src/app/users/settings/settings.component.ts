import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../interfaces/common.interface';
import {CustomValidator} from '../../services/custom-validator';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsForm: FormGroup;
  isChangePassword = false;
  timeZones: any[] = [];

  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  get user(): User {
    return this.api.user;
  }

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {

    this.api.getTimeZones().subscribe((res: any) => {
      this.timeZones = res;
    });

    this.settingsForm = this.formBuilder.group({
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      company: [''],
      site: [''],
      telephone: [''],
      isServicePaused: [''],
      wmr: [''],
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
    return (CustomValidator.errorMap[key]) ? CustomValidator.errorMap[key] : '';
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
    this.api.updateUser(value)
  }
}
