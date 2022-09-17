import { FieldError } from '@app/interfaces/common.interface';

export class ApiError {
  constructor(public error: FieldError[], public ok: boolean, public status?: number, public statusText?: string, public originalResult?: any) {
    if (!this.originalResult) {
      this.originalResult = error;
    }
  }
}
