export interface User {
  id: number;
  name: string;
  company: string;
  site: string;
  telephone: string;
  email: string;
  balance: string;
  balancePartner: string;
  registerIp: string;
  lastLoginIp: string;
  addedDateTime: string;
  comment: string;
  isServicePaused: number;
  invitedByUserId: number;
  isPartner: number;
  enablePartnerPayments: number;
  wmr: string;
  timezone: string;
  language: string;
  languages: string[];
  accessToken?: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  currency: string;
  config: any;
  extensionSettings: any;
  notifications: UserNotification[];
  paidUntilDateTime: string;
  partnerPercent: string;
  isPaid: boolean;
}

export interface UserNotification {
  id: string;
  color: string;
  title: string;
  text: string;
}

export interface ListResponse<T> {
  items: T[];
  _links: {
    self: {
      href: string;
    };
    first?: {
      href: string;
    };
    next?: {
      href: string;
    };
    last?: {
      href: string;
    };
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
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
    };
    self: {
      href: string;
    };
    last?: {
      href: string;
    };
  };
  _meta: {
    totalCount: number;
    pageCount: number;
    currentPage: number;
    perPage: number;
  };
}

export interface ParentContent {
  id?: number;
  title: string;
  type: number;
  sourceLink: string;
  text: string;
  status: number;
  length: number;
  level: number;
  deleted: number;
  tagsJson: string[];
  dataJson: DataJson;
  format: string;
  cleanText?: any;
  imageUrl?: string;
  titleTranslated: string;
}

export interface Content extends ParentContent {
  recommendedVideos: ParentContent[];
  categories: Category[];
  contentAttribute: ContentAttributeResponse;
}

export interface DataJson {
  duration?: number;
  youtubeVideo?: YoutubeVideo;
}

export interface YoutubeVideo {
  channel: Channel;
  videoId: string;
  channelId: string;
  likeCount: number;
  published: string;
  viewCount: number;
  wilsonScore: number;
  dislikeCount: number;
  averageRating: number;
  subtitleLanguages: string[];
  category: string;
}

export interface Channel {
  id: string;
  title: string;
  videoCount: number;
  subscriberCount: number;
}

export interface ContentsArray {
  items: Content[];
  _links: {
    self: {
      href: string;
    };
    next?: {
      href: string;
    };
    last?: {
      href: string;
    };
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

export interface UserDictionary {
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
  words?: UserDictionary[];
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
  user_rating?: any;
  mnemonicsUsers: MnemonicUser[];
  addedDateTime?: number;
  updateDateTime?: number;
}

export interface MnemonicUser {
  mnemonics_id: number;
  users_id: number;
  rating: string;
}

export interface DictionaryArray {
  items: UserDictionary[];
  _links: {
    next?: {
      href: string;
    };
    self: {
      href: string;
    };
    last?: {
      href: string;
    };
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

export interface UserPaymentMethod {
  id: number;
  userId: number;
  type: string;
  title: string;
}

export interface AddCardSquareRequest {
  nonce: string;
  verificationToken?: string;
}

export interface ProlongSubscriptionResult {
  status: boolean;
  message: string;
}

export interface ContentStudiedAttributeRequest {
  isStudied: boolean;
}

export interface ContentHiddenAttributeRequest {
  isHidden: boolean;
}

export interface ContentAttributeResponse {
  id: number;
  contentId: number;
  userId: number;
  isStudied: boolean;
  isHidden: boolean;
}

export interface Category {
  id?: number;
  title: string;
  parent_id: number;
}

export interface Training {
  cards: TrainingCards;
  drills: Drill[];
}

export interface TrainingCards {
  [key: string]: WordInfo | KanjiCardInfo | TrainingQuestionCard;
}

export interface Drill {
  card: string;
  isFinished: boolean;
  isAnsweredCorrectly: boolean;
  answerStartTime: number;
  answerEndTime: number;
}

export interface WordInfo {
  cardType: string;
  wordId: number;
  frequencyRank: number;
  value: string;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  exampleSentences: TrainingExampleSentence[];
  countExampleSentencesToShow: number;
  kanji: KanjiInfo[];
  audioUrls: string[];
  mnemonic: TrainingMnemonic;
}

export interface KanjiCardInfo {
  cardType: string;
  wordId: number;
  value: string;
  frequencyRank: number;
  meanings: TrainingMeaning[];
  mnemonic: TrainingMnemonic;
  kunReadings: TrainingKanjiReading[];
  onReadings: TrainingKanjiReading[];
}

export interface TrainingQuestionCard {
  cardType: string;
  wordId: number;
  infoCard: string;
  question: TrainingQuestion | TrainingButtonQuestion;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  mnemonic: TrainingMnemonic;
  audioUrls?: string[];
}

export interface TrainingMeaning {
  lang: string;
  value: string;
}

export interface TrainingExampleSentence {
  sentenceId: number;
  value: string;
  furiganaHtml: string;
  translationHtml: string;
  audioUrls?: string[];
  videoUrls?: string[];
}

export interface KanjiInfo {
  wordId: number;
  value: string;
  readings: KanjiReading[];
  meanings: TrainingMeaning[];
  infoCard: string;
}

export interface KanjiReading {
  type: string;
  value: string;
  frequencyPercent: number;
}

export interface TrainingMnemonic {
  imageUrl: string;
}

export interface TrainingKanjiReading {
  type: string;
  value: string;
  frequencyPercent: number;
  exampleWords: TrainingKanjiExampleWord[];
  countExampleWordsToShow: number;
}

export interface TrainingKanjiExampleWord {
  wordId: number;
  infoCard: string;
  value: string;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  countExampleSentencesToShow: number;
  exampleSentences: TrainingExampleSentence[];
  audioUrls: string[];
}

export interface TrainingQuestion {
  type: string;
  questionHtml: string;
  isAudioQuestion?: boolean;
  showAudio?: boolean;
  showBigAudio?: boolean;
  sentence?: TrainingExampleSentence;
  answers: TrainingAnswer[];
  openAnswers?: TrainingAnswer[];
}

export interface TrainingAnswer {
  contentHtml: string;
  audioUrls?: string[];
  isCorrectAnswer?: boolean;
}

export interface TrainingButtonQuestion {
  type: string;
  buttons: string[];
  correctAnswers: string[];
}

export interface TrainingEndMessage {
  success: boolean;
  finishContent: {
    title: string;
    text: string;
  };
}

export interface TrainingSetting {
  settings: Setting;
  drills: Drill[];
}

export interface Setting {
  disabledCardTypes: string[];
  autoPlayAudio: boolean;
}

export interface Hidings {
  cardToHide: string;
  mode: string;
  drills: Drill[];
}
