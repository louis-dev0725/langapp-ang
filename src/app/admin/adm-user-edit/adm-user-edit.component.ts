import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '@app/services/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@app/interfaces/common.interface';
import {CustomValidator} from '@app/services/custom-validator';
import {SessionService} from '@app/services/session.service';
import {ApiError} from '@app/services/api-error';
import {MatSnackBar} from '@angular/material';
import {EventService} from '@app/event.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-adm-user-edit',
  templateUrl: './adm-user-edit.component.html',
  styleUrls: ['./adm-user-edit.component.scss']
})
export class AdmUserEditComponent implements OnInit, OnDestroy {

  private _errors = [];
  private globalEventSubscription;
  private snackbarMessages = {
    'snackbar.user-edit-success':'User profile was successfully saved'
  };

  isChangePassword = false;
  userProfile: FormGroup;
  user: User;
  timeZones: any[] = [];
  get selectedTimeZone(): any {
    if (this.user) {
      return this.user.timezone;
    }
    return  '';
  }

  get errors() {
    return this._errors;
  };

  constructor(
    private api: ApiService,
    private customValidator: CustomValidator,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private session: SessionService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.user = this.session.userToEdit;

    this.callTranslate();

    this.globalEventSubscription = this.eventService.emitter.subscribe((event) => {
      if (event.type === 'language-change') {
        this.callTranslate()
      }
    });

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

  ngOnDestroy(): void {

  }

  get isServicePaused(): boolean {
    if (!this.user) {
      return false;
    }
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

  onProfileSave() {
    console.log(this.userProfile.value);
    this.api.updateUser(this.userProfile.value).subscribe((res) => {
      if (res instanceof ApiError) {
        this._errors = res.error;
      } else {
        this.snackBar.open(this.snackbarMessages['snackbar.user-edit-success'],  null,{duration: 3000});
      }
    })
  }

  private callTranslate() {
    this.translate.get(Object.keys(this.snackbarMessages)).subscribe((res) => {
      this.snackbarMessages = res;
    })
  }

  recalculatePartnerBalance() {
    this.api.getClientsList(this.user.id).subscribe((res) => {
      if (res instanceof ApiError) {
        this.snackBar.open('Error when recalculating balance', null, {duration: 3000})
      } else {
        this.snackBar.open('Balance recalculated', null, {duration: 3000});
      }
    })
  }
}
