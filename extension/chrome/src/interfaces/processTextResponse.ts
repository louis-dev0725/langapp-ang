export interface ProcessTextResponse {
  success: boolean;
  words: Word[];
  offsetStart: number;
  offsetEnd: number;
}

interface Word {
  id: number;
  dictionary: number;
  idInDictionary: number;
  query: string[];
  sourceData: any;
  value: string;
  reading: string;
  reasons: any[];
  isBaseform: boolean;
  offsetStart: number;
  offsetEnd: number;
  translations: Translation[];
  kana: Kana[];
}

interface Kana {
  text: string;
  common: boolean;
  furigana: Furigana[];
}

interface Furigana {
  text: string;
  furigana: string;
}

interface Translation {
  lang: string;
  text: string;
}