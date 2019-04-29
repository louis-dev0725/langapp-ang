import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../services/api.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  set isServicePaused(val: boolean) {
    this.user.isServicePaused = val;
  }

  get user(): User {
    return  this.api.user;
}

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.api.getTimeZones().subscribe((res) => {
    });

    this.settingsForm = this.formBuilder.group({
      name: ['', {validators: [Validators.required], updateOn: 'change'}],
      email: ['', {validators: [Validators.required, Validators.email], updateOn: 'change'}],
      password: ['', {validators: [Validators.required], updateOn: 'change'}],
      passrepeat: ['', {validators: [Validators.required], updateOn: 'change'}],
      company: [''],
      site: [''],
      telephone: [''],
      isServicePaused: [''],
      wmr: [''],
      timezone: [''],
      language: ['']
    }, {validator: CustomValidator.confirmPasswordCheck})

  }

  checkError(fieldName: string) {
    return !this.settingsForm.get(fieldName).valid
  }

  getError(fieldName: string) {

  }

  onPasswordFlagChange() {
    if (this.isChangePassword) {

    }
    this.isChangePassword = !this.isChangePassword;
  }
}
