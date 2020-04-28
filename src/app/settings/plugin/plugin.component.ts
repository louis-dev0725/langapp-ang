import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ApiError } from '@app/services/api-error';
import { SessionService } from '@app/services/session.service';
import { CustomValidator } from '@app/services/custom-validator';
import { ApiService } from '@app/services/api.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit, OnDestroy {

  settingsPluginForm: FormGroup;
  user;
  translation_options: string[] = [
    'extension.DoubleClick', 'extension.DoubleClickCtrl', 'extension.DoubleClickShift', 'extension.DoubleClickAlt'
  ];
  formValue = {
    id: '',
    user_id: '',
    extensionShowTranslate: '',
  };

  constructor(private api: ApiService, private formBuilder: FormBuilder, private customValidator: CustomValidator,
    private snackBar: MatSnackBar, private session: SessionService) { }

  private _isLoaded = false;

  @Input()
  set isLoaded(val: boolean) {
    this._isLoaded = val;
  }

  get isLoaded(): boolean {
    return this._isLoaded;
  }

  ngOnInit() {
    this.user = this.session.user;

    this.settingsPluginForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      user_id: new FormControl(this.user.id, [Validators.required]),
      extensionShowTranslate: new FormControl('extension.DoubleClick', [Validators.required]),
    });

    this.api.getSettingById(this.user.id).pipe(untilDestroyed(this)).subscribe((res) => {
      if (res === null) {
        this.settingsPluginForm.patchValue({
          id: '',
          user_id: this.user.id,
          extensionShowTranslate: 'extension.DoubleClick'
        });
      } else {
        this.settingsPluginForm.patchValue({
          id: res.id,
          user_id: res.user_id,
          extensionShowTranslate: res.extensionShowTranslate,
        });
      }

      this._isLoaded = true;
    });
  }

  onSubmit() {
     this._isLoaded = false;

     this.api.createUpdateSettingById(this.settingsPluginForm.value).pipe(untilDestroyed(this)).subscribe(res => {
      if (!(res instanceof ApiError)) {
        this.snackBar.open(this.customValidator.messagesMap['snackbar.settings-edit-success'], null, { duration: 3000 });
        window.postMessage({ type: 'saveSettingExtension', text: 'ExtensionSettingPlugin_' + this.user.id}, '*');
      }

      this._isLoaded = true;
     });
  }

  ngOnDestroy (): void {}
}
