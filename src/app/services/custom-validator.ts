import {AbstractControl} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomValidator {


  static errorMap = {
    required: 'This field is required',
    email: 'This is not valid email',
    passconfirm: 'Password and repeat password are not equals'
  };

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
