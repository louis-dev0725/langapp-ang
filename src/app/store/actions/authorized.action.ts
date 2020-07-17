import { Action } from '@ngrx/store';

export const LOAD_AUTHORIZED = '[Authorized] Load Authorized';
export const LOAD_AUTHORIZED_FAIL = '[Authorized] Load Authorized Fail';
export const LOAD_AUTHORIZED_SUCCESS = '[Authorized] Load Authorized Success';
export const AUTHORIZED_UPDATE_TOKEN = '[Authorized] Update Token';
export const AUTHORIZED_UPDATE_USER = '[Authorized] Update User';
export const AUTHORIZED_SAVE_ADMIN = '[Authorized] Save Admin';
export const AUTHORIZED_LOGOUT_AS_USER = '[Authorized] Log Out as User';
export const LOG_OUT_AUTHORIZED = '[Authorized] Log Out';

export class LoadAuthorized implements Action {
  readonly type = LOAD_AUTHORIZED;
}

export class LoadAuthorizedFail implements Action {
  readonly type = LOAD_AUTHORIZED_FAIL;

  constructor(public payload: any) {}
}
export class LoadAuthorizedSuccess implements Action {
  readonly type = LOAD_AUTHORIZED_SUCCESS;

  constructor(public payload: any) {}
}

export class AuthorizedSaveAdminAction implements Action {
  readonly type = AUTHORIZED_SAVE_ADMIN;

  constructor(public payload: any) {}
}
export class AuthorizedUpdateUserAction implements Action {
  readonly type = AUTHORIZED_UPDATE_USER;

  constructor(public payload: any) {}
}
export class AuthorizedUpdateTokenAction implements Action {
  readonly type = AUTHORIZED_UPDATE_TOKEN;

  constructor(public payload: string) {}
}

export class LogOutAction implements Action {
  readonly type = LOG_OUT_AUTHORIZED;
}

export class LogOutAsUserAction implements Action {
  readonly type = AUTHORIZED_LOGOUT_AS_USER;
  constructor(public payload: any) {}
}

export type AuthorizedAction =
  | LoadAuthorized
  | LoadAuthorizedFail
  | LoadAuthorizedSuccess
  | AuthorizedUpdateTokenAction
  | AuthorizedUpdateUserAction
  | AuthorizedSaveAdminAction
  | LogOutAsUserAction
  | LogOutAction;
