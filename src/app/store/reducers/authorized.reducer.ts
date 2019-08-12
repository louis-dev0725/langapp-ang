import * as fromAuthorized from '../actions/authorized.action';

export interface AuthorizedState {
  data: any;
  loaded: boolean;
  loading: boolean;
  token: string;
}

export const initialState: AuthorizedState = {
  data: localStorage.getItem('saveAdmin') ? JSON.parse(localStorage.getItem('saveAdmin')) : JSON.parse(localStorage.getItem('user')),
  loaded: false,
  loading: false,
  token: localStorage.getItem('token')
};

export function reducer(state: AuthorizedState = initialState, action: fromAuthorized.AuthorizedAction): AuthorizedState {
  switch (action.type) {
    case fromAuthorized.LOAD_AUTHORIZED: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAuthorized.LOAD_AUTHORIZED_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromAuthorized.LOAD_AUTHORIZED_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        token: action.payload
      };
    }

    case fromAuthorized.LOG_OUT_AUTHORIZED: {
      localStorage.removeItem('token');
      return {
        data: null,
        loaded: false,
        loading: false,
        token: ''
      };
    }
  }

  return state;
}

export const getAuthorizedData = (state: AuthorizedState): string[] => state.data;
export const getAuthorizedLoaded = (state: AuthorizedState): boolean => state.loaded;
export const getAuthorizedLoading = (state: AuthorizedState): boolean => state.loading;
export const isLoggedIn = (state: AuthorizedState): boolean => !!state.token;
