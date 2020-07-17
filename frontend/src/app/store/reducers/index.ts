import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { AccountState } from '@app/store/reducers/account.reducer';
import * as fromAuthorized from '@app/store/reducers/authorized.reducer';
import * as fromAccount from '@app/store/reducers/account.reducer';

export interface State {
  authorized: fromAuthorized.AuthorizedState;
}

export const reducers: ActionReducerMap<State> = {
  authorized: fromAuthorized.reducer
};

export const getAccountState = createFeatureSelector<fromAccount.AccountState>('account');

export const getAccount = createSelector(
  getAccountState,
  fromAccount.getAccountData
);
export const getAccountLoaded = createSelector(
  getAccountState,
  (state: AccountState): boolean => state.loaded
);

export const getAuthorizedState = createFeatureSelector<fromAuthorized.AuthorizedState>('authorized');

export const getAuthorized = createSelector(
  getAuthorizedState,
  fromAuthorized.getAuthorizedData
);
export const getAuthorizedLoaded = createSelector(
  getAuthorizedState,
  fromAuthorized.getAuthorizedLoaded
);
export const getAuthorizedLoading = createSelector(
  getAuthorizedState,
  fromAuthorized.getAuthorizedLoading
);

export const isAdminSelector = createSelector(
  getAccountState,
  (state: AccountState): boolean => (state.data ? state.data.isAdmin : false)
);
