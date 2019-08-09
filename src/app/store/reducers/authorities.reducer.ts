import * as fromAuthorities from '../actions/authorities.action';

export interface AuthoritiesState {
  data: string[];
  loaded: boolean;
  loading: boolean;
}

export const initialState: AuthoritiesState = {
  data: [],
  loaded: false,
  loading: false
};

export function reducer(state: AuthoritiesState = initialState, action: fromAuthorities.AuthoritiesAction): AuthoritiesState {
  switch (action.type) {
    case fromAuthorities.LOAD_AUTHORITIES: {
      return {
        ...state,
        loading: true
      };
    }

    case fromAuthorities.LOAD_AUTHORITIES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }

    case fromAuthorities.LOAD_AUTHORITIES_SUCCESS: {
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload
      };
    }
  }

  return state;
}

export const getAuthoritiesData = (state: AuthoritiesState): string[] => state.data;
export const getAuthoritiesLoaded = (state: AuthoritiesState): boolean => state.loaded;
export const getAuthoritiesLoading = (state: AuthoritiesState): boolean => state.loading;
