export class JapaneseWordData {
  isWord: true;
  readings: Reading[];
  meanings: Meaning[];
  partOfSpeech: PartOfSpeech[];
  frequencyPmw?: number;
  frequencyRank?: number;
  frequencySource?: string;
  jlptLevel: number;
  [key: string]: any;
  exampleSentences: ExampleSentence[];
}

export class PartOfSpeech {
  value: string;
  source?: string;
}

export class Reading {
  kanji: string;
  kana: string;
  common: boolean;
  furigana: Furigana[];
  source?: string;
  info?: Info[]; // tags
  frequencyPmw?: number;
  frequencyRank?: number;
  frequencySource?: string;
  [key: string]: any;
}

export class Furigana {
  ruby: string;
  rt: string;
}

export class Meaning {
  lang: string;
  value: string;
  source?: string;
  info?: Info[]; // info, dialect, field, misc, languageSource
  related?: Related[]; // antonym
  appliesTo?: string[]; // appliesToKana, appliesToKanji
  probabilityInList?: number;
  probabilityOverall?: number;
  frequencyPmw?: number;
  frequencySource?: string;
  exampleSentences: ExampleSentence[];
}

export class ExampleSentence {
  sentenceId: number;
  score: number;
}

export class Related {
  value: string;
  reason: string;
}

export class Info {
  value: string;
  type?: string;
  [key: string]: any;
}
