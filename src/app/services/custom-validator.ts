import {AbstractControl} from '@angular/forms';

export class CustomValidator {
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
