import {AbstractControl} from '@angular/forms';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EventService} from '@app/event.service';

@Injectable()
export class CustomValidator {


  errorMap = {
    required: 'This field is required',
    email: 'This is not valid email',
    passconfirm: 'Password and repeat password are not equals',
    min: 'The amount must be equals to or greater than'
  };

  messagesMap = {
    'snackbar.balance-edit-error': 'Error when recalculating balance',
    'snackbar.settings-edit-success': 'Settings was successfully saved',
    'snackbar.user-edit-success': 'User profile was successfully saved',
  };


  constructor(
    private eventService: EventService,
    private translate: TranslateService) {
    this.callTranslate();
    this.eventService.emitter.subscribe((event) => {
      if (event.type === 'language-change') {
        this.callTranslate();
      }
    })
  }

  callTranslate() {
    const keys = Object.keys(this.errorMap).map((key) => {
      return 'valid-err.' + key;
    });
    const originalKeys = Object.keys(this.errorMap);
    this.translate.get(keys).subscribe((res) => {
      originalKeys.forEach((key, idx) => {
        this.errorMap[key] = res[keys[idx]];
      })
    });
    this.translate.get(Object.keys(this.messagesMap)).subscribe((res) => {
      this.messagesMap = res;
    })
  }

  /**
   * this method used as a custom validator to check
   * the password and repeat-password is equaled or not
   * @param ctrl
   */
  static confirmPasswordCheck(ctrl: AbstractControl) {
    const password = ctrl.get('password').value;
    const passrepeat = ctrl.get('passrepeat').value;
    if (password !== passrepeat) {
      ctrl.get('passrepeat').setErrors({passconfirm: true});
    } else {
      return null;
    }
  }
}
