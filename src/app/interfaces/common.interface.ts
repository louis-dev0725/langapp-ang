export interface User {
  accessToken?: string;
  balance?: number;
  balancePartner: number;
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
  registerIp?: string;
  lastLoginIp?: string;
  addedDateTime?: string;
  isPartner?: any;
  invitedByUserId?: any;
  enablePartnerPayments?: any;
  comment?: any;
}

export interface InvitedUser {
  id: number;
  name: string;
  partnerEarned: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface Operations {
  id: number;
  addedDateTime: string;
  money: number;
  comment: number;
}

export interface Transaction {
  id?: number;
  userId?: number;
  name?: string;
  token?: string;
  money: number;
  comment: string;
  isCommon?: number;
  isPartner: number;
  isRealMoney?: number;
  fromInvitedUserId?: number;
}
