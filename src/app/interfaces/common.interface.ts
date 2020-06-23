export interface User {
  id?: number;
  name: string;
  company: string;
  site: string;
  telephone: string;
  email: string;
  balance: number;
  balancePartner: number;
  registerIp?: string;
  lastLoginIp?: string;
  addedDateTime?: string;
  comment?: any;
  isServicePaused?: boolean;
  invitedByUserId?: any;
  isPartner?: any;
  enablePartnerPayments?: any;
  wmr?: string;
  timezone: string;
  language: string;
  main_language: any;
  language1: any;
  language2?: any;
  language3?: any;
  homeLanguage?: Language;
  languageOne?: Language;
  languageTwo?: Language;
  languageThree?: Language;
  accessToken?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currency?: any;
  config?: any;
}

export interface InvitedUser {
  id?: number;
  name: string;
  partnerEarned: number;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface Operations {
  id?: number;
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
  parentCategory?: any;
}

export interface CategoryArray {
  items: Category[];
  _links: {
    next?: {
      href: string;
    },
    self: {
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

export interface Contents {
  id?: number;
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
  id?: number;
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
  mnemonic_id: number;
  checked: boolean;
  words?: Dictionary[];
  word_on?: string;
  mnemonic_all?: Mnemonic[];
  mnemonic?: Mnemonic;
  word_kun?: string;
  word_translate?: string;
  dictionaryWord?: any;
}

export interface Mnemonic {
  id?: number;
  user_id: number;
  word: string;
  text: string;
  images: string;
  rating: number;
  addedDateTime: number;
  updateDateTime: number;
}

export interface DictionaryArray {
  items: Dictionary[];
  _links: {
    next?: {
      href: string;
    },
    self: {
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
  due: number;
  interval: number;
  reviews: CardReview[];
  easeFactor: number;
  consecutiveCorrectAnswers: number;
}
