import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SessionService } from '@app/services/session.service';
import { CustomValidator } from '@app/services/custom-validator';

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit {

  settingsPluginForm: FormGroup;
  user;
  translation_options: string[] = [
    'extension.DoubleClick', 'extension.DoubleClickCtrl', 'extension.DoubleClickShift', 'extension.DoubleClickAlt'
  ];
  formValue = {
    id: '',
    extensionShowTranslate: '',
  };

  constructor(private formBuilder: FormBuilder, private customValidator: CustomValidator,
    private snackBar: MatSnackBar, private session: SessionService) { }

  ngOnInit() {
    this.user = this.session.user;

    this.settingsPluginForm = new FormGroup({
      id: new FormControl(this.user.id, [Validators.required]),
      extensionShowTranslate: new FormControl('extension.DoubleClick', [Validators.required]),
    });

    this.formValue = JSON.parse(this.session.settingPluginGet(this.user.id));
    if (this.formValue !== null) {
      this.settingsPluginForm.patchValue({
        id: this.formValue.id,
        extensionShowTranslate: this.formValue.extensionShowTranslate,
      });
    }
  }

  onSubmit() {
    this.session.settingPluginSave(this.settingsPluginForm.value, this.user.id);
    this.snackBar.open(this.customValidator.messagesMap['snackbar.settings-edit-success'], null, { duration: 3000 });
  }
}
