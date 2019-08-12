import { Action } from '@ngrx/store';

export const LOAD_AUTHORIZED = '[Authorized] Load Authorized';
export const LOAD_AUTHORIZED_FAIL = '[Authorized] Load Authorized Fail';
export const LOAD_AUTHORIZED_SUCCESS = '[Authorized] Load Authorized Success';
export const LOG_OUT_AUTHORIZED = 'LOG_OUT_AUTHORIZED';

export class LoadAuthorized implements Action {
  readonly type = LOAD_AUTHORIZED;
}

export class LoadAuthorizedFail implements Action {
  readonly type = LOAD_AUTHORIZED_FAIL;

  constructor(public payload: any) {}
}

export class LoadAuthorizedSuccess implements Action {
  readonly type = LOAD_AUTHORIZED_SUCCESS;

  constructor(public payload: string) {}
}

export class LogOutAction implements Action {
  readonly type = LOG_OUT_AUTHORIZED;
}

export type AuthorizedAction = LoadAuthorized | LoadAuthorizedFail | LoadAuthorizedSuccess | LogOutAction;
