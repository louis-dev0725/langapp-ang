

export interface Menu {
  state: string;
  menukey: string;
  name: string;
  children?: Menu[];
  isAdmin: boolean;
}

export interface User {
  name: string;
  company?: string;
  telephone?: string;
  email: string;
  timezone: string;
  language: string;
  site?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
}


