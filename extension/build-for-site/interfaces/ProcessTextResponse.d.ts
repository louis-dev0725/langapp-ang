export interface ProcessTextResponse {
    success: boolean;
    offsetStart: number;
    offsetEnd: number;
    words: JapaneseResultItem[];
}
export interface JapaneseWordData {
    isWord: true;
    readings: Reading[];
    meanings: Meaning[];
    partOfSpeech: PartOfSpeech[];
    frequencyPmw?: number;
    frequencyRank?: number;
    frequencySource?: string;
    jlptLevel: number;
}
export interface PartOfSpeech {
    value: string;
    source?: string;
}
export interface Reading {
    kanji: string;
    kana: string;
    common: boolean;
    current?: boolean;
    furigana: Furigana[];
    source?: string;
    info?: Info[];
    frequencyPmw?: number;
    frequencyPercent?: number;
    frequencySource?: string;
}
export interface Furigana {
    ruby: string;
    rt: string;
}
export interface Meaning {
    lang: string;
    value: string;
    source?: string;
    info?: Info[];
    related?: Related[];
    appliesTo?: string[];
    probability?: number;
}
export interface Related {
    value: string;
    reason: string;
}
export interface Info {
    value: string;
    type?: string;
    [key: string]: any;
}
export declare type Reason = {
    pos?: string;
    subpos?: string;
    conjType?: string;
    conjForm?: string;
};
interface Variant {
    value: string;
    reading: string;
    reasons: Reason[];
    isBaseform: boolean;
    offsetStart: number;
    offsetEnd: number;
}
export declare enum DictionaryType {
    JapaneseWords = 1,
    JapaneseKanji = 2
}
export declare type JapaneseResultItem = JapaneseWordData & Variant & {
    id: number;
    type: DictionaryType;
    currentReadingIsCommon?: boolean;
};
export {};
