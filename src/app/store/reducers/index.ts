import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { AccountState } from '@app/store/reducers/account.reducer';

export interface State {
  // authorities: fromAuthorities.AuthoritiesState;
  account: fromAccount.AccountState;
}

export const reducers: ActionReducerMap<State> = {
  // authorities: fromAuthorities.reducer,
  account: fromAccount.reducer
};

// Account state
import * as fromAccount from './account.reducer';

export const getAccountState = createFeatureSelector<fromAccount.AccountState>('account');

export const getAccount = createSelector(
  getAccountState,
  fromAccount.getAccountData
);
export const getAccountLoaded = createSelector(
  getAccountState,
  (state: AccountState): boolean => state.loaded
);

// Authorities state

// import * as fromAuthorities from './authorities.reducer';
// export const getAuthoritiesState = createFeatureSelector<fromAuthorities.AuthoritiesState>('authorities');

/*export const getAuthorities = createSelector(
  getAuthoritiesState,
  fromAuthorities.getAuthoritiesData
);
export const getAuthoritiesLoaded = createSelector(
  getAuthoritiesState,
  fromAuthorities.getAuthoritiesLoaded
);
export const getAuthoritiesLoading = createSelector(
  getAuthoritiesState,
  fromAuthorities.getAuthoritiesLoading
);*/
