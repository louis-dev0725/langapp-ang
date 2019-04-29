

export interface User {
  accessToken?: string;
  id?: number;
  name: string;
  company?: string;
  telephone?: string;
  email: string;
  timezone: string;
  language: string;
  site?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isServicePaused?: boolean;
  wmr?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

