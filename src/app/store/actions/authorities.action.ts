import { Action } from '@ngrx/store';

export const LOAD_AUTHORITIES = '[Authorities] Load Authorities';
export const LOAD_AUTHORITIES_FAIL = '[Authorities] Load Authorities Fail';
export const LOAD_AUTHORITIES_SUCCESS = '[Authorities] Load Authorities Success';

export class LoadAuthorities implements Action {
  readonly type = LOAD_AUTHORITIES;
}

export class LoadAuthoritiesFail implements Action {
  readonly type = LOAD_AUTHORITIES_FAIL;

  constructor(public payload: any) {}
}

export class LoadAuthoritiesSuccess implements Action {
  readonly type = LOAD_AUTHORITIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export type AuthoritiesAction = LoadAuthorities | LoadAuthoritiesFail | LoadAuthoritiesSuccess;
