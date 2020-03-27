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
  currency?: any;
  config?: any;
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

export interface Materials {
  id?: number;
  title: string;
  type_content: number;
  source_link: string;
  text: string;
  status: number;
  count_symbol: number;
  level_JLPT: string;
  deleted: number;
  category?: any;
}

export interface Category {
  id?: number;
  title: string;
  parent_id: number;
}

export interface CategoryArray {
  items: [
    {
      id: number;
      title: string;
      parent_id: number;
      parentCategory?: any;
    }
  ];
  _links: {
    self: {
      href: string;
    },
    next?: {
      href: string;
    },
    last?: {
      href: string;
    }
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface TypeContent {
  id: number;
  title: string;
}

export interface Contents {
  items: [
    {
      id: number;
      title: string;
      type_content: number;
      source_link: string;
      text: string;
      status: number;
      count_symbol: number;
      level_JLPT: string;
      deleted: number;
    }
  ];
  _links: {
    self: {
      href: string;
    },
    next?: {
      href: string;
    },
    last?: {
      href: string;
    }
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}
