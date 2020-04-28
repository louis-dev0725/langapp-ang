import * as fromAuthorized from '@src/app/store/actions/authorized.action';

export interface AuthorizedState {
  data: any;
  loaded: boolean;
  loading: boolean;
  token: string;
  admin: any;
}

export const initialState: AuthorizedState = {
  data: localStorage.getItem('savedAdmin') ? JSON.parse(localStorage.getItem('savedAdmin')) : JSON.parse(localStorage.getItem('user')),
  loaded: true,
  loading: false,
  token: localStorage.getItem('token'),
  admin: localStorage.getItem('savedAdmin') ? JSON.parse(localStorage.getItem('savedAdmin')) : null
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
      // localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        data: action.payload,
        loading: false,
        loaded: true
      };
    }

    case fromAuthorized.AUTHORIZED_SAVE_ADMIN: {
      // localStorage.setItem('savedAdmin', JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        loaded: true,
        admin: action.payload
      };
    }

    case fromAuthorized.AUTHORIZED_LOGOUT_AS_USER: {
      // localStorage.removeItem('savedAdmin');
      return {
        ...state,
        data: action.payload,
        loading: false,
        loaded: true,
        admin: null
      };
    }
    case fromAuthorized.AUTHORIZED_UPDATE_USER: {
      // localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    }

    case fromAuthorized.AUTHORIZED_UPDATE_TOKEN: {
      localStorage.setItem('token', action.payload);
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
        loading: false,
        loaded: true,
        token: '',
        admin: null
      };
    }
  }

  return state;
}

export const getAuthorizedData = (state: AuthorizedState): string[] => state.data;
export const getAuthorizedLoaded = (state: AuthorizedState): boolean => state.loaded;
export const getAuthorizedLoading = (state: AuthorizedState): boolean => state.loading;
export const isLoggedIn = (state: AuthorizedState): boolean => !!state.token;
