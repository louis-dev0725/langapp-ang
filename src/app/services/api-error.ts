import { FieldError } from '@src/app/interfaces/common.interface';

export class ApiError {
  constructor(public error: FieldError[], public ok: boolean, public status?: number, public statusText?: string) {}
}
