import * as fromAccount from '../actions/account.action';
import { User } from '@app/interfaces/common.interface';

export interface AccountState {
  data: User;
  loaded: boolean;
  loading: boolean;
}

export const initialState: AccountState = {
  data: JSON.parse(localStorage.getItem('user')),
  loaded: false,
  loading: false
};

export function reducer(state = initialState, action: fromAccount.AccountAction): AccountState {
  switch (action.type) {
    case fromAccount.LOAD_ACCOUNT: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAccount.LOAD_ACCOUNT_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }

    case fromAccount.LOAD_ACCOUNT_SUCCESS: {
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.payload
      };
    }

    case fromAccount.REMOVE_ACCOUNT_SUCCESS: {
      localStorage.removeItem('user');
      return {
        ...state,
        data: null,
        loaded: false,
        loading: false
      };
    }

    case fromAccount.UPDATE_ACCOUNT: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAccount.UPDATE_ACCOUNT_SUCCESS: {
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        loaded: true,
        loading: false,
        data: action.payload
      };
    }

    case fromAccount.UPDATE_ACCOUNT_FAIL: {
      return {
        ...state,
        loaded: false,
        loading: false
      };
    }
  }

  return state;
}

export const getAccountLoading = (state: AccountState): boolean => state.loading;
export const getAccountLoaded = (state: AccountState): boolean => state.loaded;
export const getAccountData = (state: AccountState) => state.data;
