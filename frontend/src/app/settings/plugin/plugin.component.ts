import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiError } from '@app/services/api-error';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiService } from '@app/services/api.service';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from '@app/interfaces/common.interface';
import { UserService } from '@app/services/user.service';
import { TranslateService } from '@ngx-translate/core';

@UntilDestroy()
@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss'],
})
export class PluginComponent implements OnInit, OnDestroy {
  settingsPluginForm: UntypedFormGroup;
  user;
  translation_options: string[] = ['DoubleClick', 'DoubleClickCtrl', 'DoubleClickShift', 'DoubleClickAlt'];
  formValue = {
    clickModifier: null,
    processSubtitles: true,
  };

  constructor(private api: ApiService, private formBuilder: UntypedFormBuilder, private customValidator: CustomValidator, private snackBar: MatSnackBar, private userService: UserService, private cd: ChangeDetectorRef, private translateService: TranslateService) {}

  private _isLoaded = false;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  ngOnInit() {
    this.userService.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
      this.cd.markForCheck();
    });

    this.settingsPluginForm = new UntypedFormGroup({
      clickModifier: new UntypedFormControl('DoubleClick', [Validators.required]),
      processSubtitles: new UntypedFormControl(true, [Validators.required]),
    });

    this.api
      .usersMe()
      .pipe(untilDestroyed(this))
      .subscribe((user: User) => {
        this.user = user;
        this.settingsPluginForm.patchValue({
          clickModifier: user.extensionSettings.clickModifier !== undefined ? user.extensionSettings.clickModifier : 'DoubleClick',
          processSubtitles: user.extensionSettings.processSubtitles !== undefined ? user.extensionSettings.processSubtitles : true,
        });

        this._isLoaded = true;
      });
  }

  onSubmit() {
    this._isLoaded = false;

    this.api
      .updateUser({ id: this.user.id, extensionSettings: this.settingsPluginForm.value })
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!(res instanceof ApiError)) {
          this.snackBar.open(this.translateService.instant('snackbar.settings-edit-success'), null, { duration: 3000 });
          window.postMessage({ type: 'saveSettingExtension', text: 'ExtensionSettingPlugin_' + this.user.id }, '*');
        }

        this._isLoaded = true;
      });
  }

  ngOnDestroy(): void {}
}
