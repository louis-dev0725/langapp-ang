import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAccount from '@app/store/reducers/account.reducer';
import * as fromAuthorized from '@app/store/reducers/authorized.reducer';


export interface State {
  authorized: fromAuthorized.AuthorizedState;
  account: fromAccount.AccountState;
}

export const reducers: ActionReducerMap<State> = {
  account: fromAccount.reducer,
  authorized: fromAuthorized.reducer
};

export const getAuthorizedState = createFeatureSelector<fromAuthorized.AuthorizedState>('authorized');

export const getAuthorizedIsLoggedIn = createSelector(
  getAuthorizedState,
  fromAuthorized.isLoggedIn
);


