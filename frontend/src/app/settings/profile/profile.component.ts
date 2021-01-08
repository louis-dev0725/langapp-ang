import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '@app/services/session.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';

@UntilDestroy()
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

  languages = [];

  addLanguage2 = false;
  addLanguage3 = false;

  private _errors = [];
  get errors() {
    return this._errors;
  }

  get isServicePaused(): boolean {
    return this.user.isServicePaused !== undefined ? this.user.isServicePaused : false;
  }

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar, private session: SessionService) {}

  ngOnInit() {
    combineLatest([this.api.meRequest(), this.api.getAllLanguage()]).pipe(untilDestroyed(this))
      .subscribe(([form, languages]) => {
      this.user = form;

      this.settingsForm.patchValue({
        id: form.id,
        name: form.name,
        email: form.email,
        company: form.company,
        site: form.site,
        telephone: form.telephone,
        wmr: form.wmr,
        timezone: form.timezone,
        language: form.language,
        main_language: form.main_language !== null ? form.homeLanguage.id : null,
        language1: form.language1 !== null ?  form.languageOne.id : null,
        language2: form.language2 !== null ?  form.languageTwo.id : null,
        language3: form.language3 !== null ?  form.languageThree.id : null
      });

      this.languages = languages.items;
    });

    this.api.getTimeZones().pipe(untilDestroyed(this)).subscribe((res: any) => {
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
      language: [''],
      main_language: [null, { validators: [Validators.required], updateOn: 'change' }],
      language1: [null],
      language2: [null],
      language3: [null],
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

  visibleLanguage2() {
    this.addLanguage2 = this.settingsForm.value.language1 !== null;
    if (this.addLanguage2 === false) {
      this.settingsForm.value.language2 = null;
      this.addLanguage3 = false;
      this.settingsForm.value.language3 = null;
    }
  }

  visibleLanguage3() {
    this.addLanguage3 = this.settingsForm.value.language2 !== null;
  }

  onSubmit(value: any) {
    if (this.settingsForm.value.language1 === null || this.settingsForm.value.language1 === '') {
      this.settingsForm.value.language2 = null;
    }
    if (this.settingsForm.value.language2 === null || this.settingsForm.value.language2 === '') {
      this.settingsForm.value.language3 = null;
    }
    this.api.updateUser(value).pipe(untilDestroyed(this)).subscribe(result => {
      if (result instanceof ApiError) {
        this._errors = result.error;
      } else {
        this.session.user = result;
        this.snackBar.open(this.customValidator.messagesMap['snackbar.settings-edit-success'], null, { duration: 3000 });
      }
    });
  }
}
