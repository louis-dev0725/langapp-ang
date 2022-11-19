import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '@app/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiError } from '@app/services/api-error';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from '@app/services/session.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { combineLatest } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  isChangePassword = false;
  timeZones: any[] = [];
  user;
  languagesPlaceholder = '';

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

  constructor(private api: ApiService, private customValidator: CustomValidator, private formBuilder: FormBuilder, private session: SessionService, private changeDetector: ChangeDetectorRef, private messageService: MessageService, private translateService: TranslateService) {}

  ngOnInit() {
    this.settingsForm = this.formBuilder.group({
      id: [''],
      name: ['', { validators: [Validators.required], updateOn: 'change' }],
      email: ['', { validators: [Validators.required, Validators.email], updateOn: 'change' }],
      //company: [''],
      //site: [''],
      telephone: [''],
      //isServicePaused: [''],
      wmr: [''],
      timezone: [''],
      language: [''],
      languages: [[], { validators: [Validators.required], updateOn: 'change' }],
    });

    combineLatest([this.api.usersMe(), this.api.getAllLanguage()])
      .pipe(untilDestroyed(this))
      .subscribe(([user, languages]) => {
        this.user = user;
        this.languages = languages.items.map((l) => ({
          label: l.title,
          value: l.code,
        }));
        this.settingsForm.patchValue({
          id: user.id,
          name: user.name,
          email: user.email,
          //company: form.company,
          //site: form.site,
          telephone: user.telephone,
          wmr: user.wmr,
          timezone: user.timezone,
          language: user.language,
          languages: user.languages,
        });
        this.languagesPlaceholder = 'Select'; // Workaround for issue https://github.com/primefaces/primeng/issues/9673
      });

    this.api
      .getTimeZones()
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.timeZones = res.map((t) => ({
          label: t.group,
          value: t.group,
          disabled: true,
          items: t.zones.map((z) => ({
            label: z.value,
            value: z.value,
          })),
        }));
      });
  }

  ngOnDestroy() {}

  checkError(fieldName: string) {
    return !this.settingsForm.get(fieldName).valid;
  }

  getError(fieldName: string) {
    return this.customValidator.getErrors(this.settingsForm, fieldName);
  }

  onPasswordFlagChange() {
    this.isChangePassword = !this.isChangePassword;
    if (this.isChangePassword) {
      this.settingsForm.addControl(
        'password',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change',
        })
      );
      this.settingsForm.addControl(
        'passrepeat',
        this.formBuilder.control('', {
          validators: [Validators.required],
          updateOn: 'change',
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
    this.api
      .updateUser(value)
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result instanceof ApiError) {
          this._errors = result.error;
        } else {
          this.messageService.add({ severity: 'success', summary: this.translateService.instant('snackbar.settings-edit-success'), detail: this.translateService.instant('snackbar.settings-edit-success') });
        }
      });
  }
}
