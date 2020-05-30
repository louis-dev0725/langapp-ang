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
  main_language: any;
  language1: any;
  language2?: any;
  language3?: any;
  homeLanguage?: Language;
  languageOne?: Language;
  languageTwo?: Language;
  languageThree?: Language;
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

export interface ContentsArray {
  items: Contents[];
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

export interface Language {
  id: number;
  title: string;
}

export interface SettingPlugin {
  id?: number;
  user_id: number;
  text: string;
}

export interface Dictionary {
  id?: number;
  context: string;
  date: string;
  dictionary_word_id: number;
  number_training: number;
  original_word: string;
  success_training: number;
  translate_word: string;
  type: number;
  url: string;
  user_id: number;
  workout_progress_card: any;
  workout_progress_word_translate: any;
  checked: boolean;
  words?: any;
  word_on?: string;
  word_kun?: string;
  word_translate?: string;
  dictionaryWord?: any;
}

export interface DictionaryArray {
  items: Dictionary[];
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

export interface CardReview {
  id?: number;
  date: Date;
  answer: number;
  oldInterval: number;
  newInterval: number;
  oldEaseFactor: number;
  newEaseFactor: number;
}

export interface Card {
  id?: number;
  status: number;
  due: Date;
  interval: number;
  reviews: CardReview[];
  easeFactor: number;
  consecutiveCorrectAnswers: number;
}
