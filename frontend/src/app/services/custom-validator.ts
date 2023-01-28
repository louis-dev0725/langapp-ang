import { AbstractControl, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomValidator {
  constructor(private translateService: TranslateService) {}

  getErrors(form: UntypedFormGroup, fieldName: string): string {
    const errors = [];
    const originalErrors = form.get(fieldName).errors;
    for (let key of Object.keys(originalErrors)) {
      let value = this.translateService.instant('validation-error.' + key);
      if (value == key) {
        value = this.translateService.instant('validation-error.default');
      }
      errors.push(value);
    }

    return errors.join('\n');
  }

  /**
   * this method used as a custom validator to check
   * the password and repeat-password is equaled or not
   * @param ctrl
   */
  static confirmPasswordCheck(ctrl: AbstractControl): ValidationErrors | null {
    const password = ctrl.get('password').value;
    const passrepeat = ctrl.get('passrepeat').value;
    if (password !== passrepeat) {
      ctrl.get('passrepeat').setErrors({ passconfirm: true });
    } else {
      return null;
    }
  }
}
