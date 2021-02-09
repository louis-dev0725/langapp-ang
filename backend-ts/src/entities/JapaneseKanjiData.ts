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
    probability?: number;
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