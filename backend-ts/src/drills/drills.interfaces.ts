export interface Training {
  cards: TrainingCards;
  drills: Drill[];
}

export interface TrainingCards {
  [key: string]: WordInfo | KanjiCardInfo | TrainingQuestionCard | TrainingButtonQuestionCard;
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
  cardId: string;
  wordId: number;
  frequencyRank: number;
  value: string;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  countMeaningsToShow: number;
  kanji: KanjiInfo[];
  audioUrls: string[];
  mnemonic: TrainingMnemonic;
}

export interface KanjiCardInfo {
  cardType: string;
  cardId: string;
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
  cardId: string;
  wordId: number;
  infoCard: string;
  question: TrainingQuestion;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  mnemonic: TrainingMnemonic;
  audioUrls?: string[];
}

export interface TrainingButtonQuestionCard {
  cardType: string;
  cardId: string;
  wordId: number;
  infoCard: string;
  question: TrainingButtonQuestion;
  furiganaHtml: string;
  meanings: TrainingMeaning[];
  mnemonic: TrainingMnemonic;
  audioUrls?: string[];
}

export interface TrainingMeaning {
  lang: string;
  value: string;
  probabilityInList?: number;
  probabilityOverall?: number;
  frequencyPmw?: number;
  exampleSentences?: TrainingExampleSentence[];
  countExampleSentencesToShow?: number;
  isOther?: boolean;
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
  isCurrent?: boolean;
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
  frequencyRank: number;
  frequencyPmw: number;
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
  questionHtml?: string;
  furiganaHtml?: string;
  meanings?: TrainingMeaning[];
  isAudioQuestion?: boolean;
  showAudio?: boolean;
  showBigAudio?: boolean;
  sentence?: TrainingExampleSentence;
  answers: TrainingAnswer[];
  openAnswers?: TrainingAnswer[];
}

export interface TrainingAnswer {
  contentHtml?: string;
  audioUrls?: string[];
  isCorrectAnswer?: boolean;
}

export interface TrainingButtonQuestion {
  questionHtml?: string;
  furiganaHtml?: string;
  meanings?: TrainingMeaning[];
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
