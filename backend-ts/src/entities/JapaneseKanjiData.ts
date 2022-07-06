export class JapaneseKanjiData {
  isKanji: true;
  value: string;
  readings: Reading[];
  meanings: Meaning[];
  radicals: RadicalList[];
  strokeCount: number;
  dictionaryReferences: DictionaryReference[];
  info?: Info[]; // codepoints, query_codes
  jlptLevel: number;
  frequencyPmw?: number;
  frequencyRank?: number;
  frequencySource?: string;
  [key: string]: any;
}

export class DictionaryReference {
  dictionaryName: string;
  value: number | string;
  source?: string;
}

export class Reading {
  value: string;
  type: 'on' | 'kun';
  source?: string;
  frequencyPmw?: number;
  frequencyRank?: number;
  frequencyPercent?: number;
  exampleWords: ExampleWord[];
  [key: string]: any;
}

export class ExampleWord {
  wordId: number;
  frequencyPmw?: number;
  frequencyRank?: number;
}

export class RadicalList {
  list: number[];
  system: string;
  source?: string;
}

export class Meaning {
  lang: string;
  value: string;
  source?: string;
  probability?: number;
}

export class Info {
  value: string;
  type?: string;
  source?: string;
  [key: string]: any;
}
