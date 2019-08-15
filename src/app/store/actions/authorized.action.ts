import { Action } from '@ngrx/store';

export const LOAD_AUTHORIZED = '[Authorized] Load Authorized';
export const LOAD_AUTHORIZED_FAIL = '[Authorized] Load Authorized Fail';
export const AUTHORIZED_UPDATE_TOKEN = '[Authorized] Update Token';
export const LOG_OUT_AUTHORIZED = 'LOG_OUT_AUTHORIZED';

export class LoadAuthorized implements Action {
  readonly type = LOAD_AUTHORIZED;
}

export class LoadAuthorizedFail implements Action {
  readonly type = LOAD_AUTHORIZED_FAIL;

  constructor(public payload: any) {}
}

export class AuthorizedUpdateTokenAction implements Action {
  readonly type = AUTHORIZED_UPDATE_TOKEN;

  constructor(public payload: string) {}
}

export class LogOutAction implements Action {
  readonly type = LOG_OUT_AUTHORIZED;
}

export type AuthorizedAction = LoadAuthorized | LoadAuthorizedFail | AuthorizedUpdateTokenAction | LogOutAction;
