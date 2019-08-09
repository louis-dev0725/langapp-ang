import { Action } from '@ngrx/store';

export const LOAD_ACCOUNT = '[Account] Load Account';
export const LOAD_ACCOUNT_FAIL = '[Account] Load Account Fail';
export const LOAD_ACCOUNT_SUCCESS = '[Account] Load Account Success';

export const UPDATE_ACCOUNT = '[Account] Update Account';
export const UPDATE_ACCOUNT_FAIL = '[Account] Update Account Fail';
export const UPDATE_ACCOUNT_SUCCESS = '[Account] Upload Account Success';

export const REMOVE_ACCOUNT = '[Account] Remove Account';
export const REMOVE_ACCOUNT_FAIL = '[Account] Remove Account Fail';
export const REMOVE_ACCOUNT_SUCCESS = '[Account] Remove Account Success';

export class LoadAccount implements Action {
  readonly type = LOAD_ACCOUNT;
}

export class LoadAccountFail implements Action {
  readonly type = LOAD_ACCOUNT_FAIL;

  constructor(public payload: any) {}
}

export class LoadAccountSuccess implements Action {
  readonly type = LOAD_ACCOUNT_SUCCESS;

  constructor(public payload) {}
}

export class UpdateAccount implements Action {
  readonly type = UPDATE_ACCOUNT;

  constructor() {}
}

export class UpdateAccountFail implements Action {
  readonly type = UPDATE_ACCOUNT_FAIL;

  constructor(public payload: any) {}
}

export class UpdateAccountSuccess implements Action {
  readonly type = UPDATE_ACCOUNT_SUCCESS;

  constructor(public payload) {}
}

export class RemoveAccount implements Action {
  readonly type = REMOVE_ACCOUNT;
}

export class RemoveAccountFail implements Action {
  readonly type = REMOVE_ACCOUNT_FAIL;

  constructor(public payload: any) {}
}

export class RemoveAccountSuccess implements Action {
  readonly type = REMOVE_ACCOUNT_SUCCESS;
}

export type AccountAction =
  | LoadAccount
  | LoadAccountFail
  | LoadAccountSuccess
  | UpdateAccount
  | UpdateAccountFail
  | UpdateAccountSuccess
  | RemoveAccount
  | RemoveAccountFail
  | RemoveAccountSuccess;
