// https://github.com/FooSoft/yomichan/blob/master/ext/mixed/js/japanese.js

const ITERATION_MARK_CODE_POINT = 0x3005;
const HIRAGANA_SMALL_TSU_CODE_POINT = 0x3063;
const KATAKANA_SMALL_TSU_CODE_POINT = 0x30c3;
const KATAKANA_SMALL_KA_CODE_POINT = 0x30f5;
const KATAKANA_SMALL_KE_CODE_POINT = 0x30f6;
const KANA_PROLONGED_SOUND_MARK_CODE_POINT = 0x30fc;

const HIRAGANA_RANGE = [0x3040, 0x309f];
const KATAKANA_RANGE = [0x30a0, 0x30ff];

const HIRAGANA_CONVERSION_RANGE = [0x3041, 0x3096];
const KATAKANA_CONVERSION_RANGE = [0x30a1, 0x30f6];

const KANA_RANGES = [HIRAGANA_RANGE, KATAKANA_RANGE];

const CJK_UNIFIED_IDEOGRAPHS_RANGE = [0x4e00, 0x9fff];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A_RANGE = [0x3400, 0x4dbf];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B_RANGE = [0x20000, 0x2a6df];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_C_RANGE = [0x2a700, 0x2b73f];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_D_RANGE = [0x2b740, 0x2b81f];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_E_RANGE = [0x2b820, 0x2ceaf];
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_F_RANGE = [0x2ceb0, 0x2ebef];
const CJK_COMPATIBILITY_IDEOGRAPHS_SUPPLEMENT_RANGE = [0x2f800, 0x2fa1f];
const CJK_UNIFIED_IDEOGRAPHS_RANGES = [
    CJK_UNIFIED_IDEOGRAPHS_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_B_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_C_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_D_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_E_RANGE,
    CJK_UNIFIED_IDEOGRAPHS_EXTENSION_F_RANGE,
    CJK_COMPATIBILITY_IDEOGRAPHS_SUPPLEMENT_RANGE
];

// Japanese character ranges, roughly ordered in order of expected frequency
const JAPANESE_RANGES = [
    HIRAGANA_RANGE,
    KATAKANA_RANGE,

    ...CJK_UNIFIED_IDEOGRAPHS_RANGES,

    [0xff66, 0xff9f], // Halfwidth katakana

    [0x30fb, 0x30fc], // Katakana punctuation
    [0xff61, 0xff65], // Kana punctuation
    [0x3000, 0x303f], // CJK punctuation

    [0xff10, 0xff19], // Fullwidth numbers
    [0xff21, 0xff3a], // Fullwidth upper case Latin letters
    [0xff41, 0xff5a], // Fullwidth lower case Latin letters

    [0xff01, 0xff0f], // Fullwidth punctuation 1
    [0xff1a, 0xff1f], // Fullwidth punctuation 2
    [0xff3b, 0xff3f], // Fullwidth punctuation 3
    [0xff5b, 0xff60], // Fullwidth punctuation 4
    [0xffe0, 0xffee]  // Currency markers
];

const SMALL_KANA_SET = new Set(Array.from('ぁぃぅぇぉゃゅょゎァィゥェォャュョヮ'));

const HALFWIDTH_KATAKANA_MAPPING = new Map([
    ['ｦ', 'ヲヺ-'],
    ['ｧ', 'ァ--'],
    ['ｨ', 'ィ--'],
    ['ｩ', 'ゥ--'],
    ['ｪ', 'ェ--'],
    ['ｫ', 'ォ--'],
    ['ｬ', 'ャ--'],
    ['ｭ', 'ュ--'],
    ['ｮ', 'ョ--'],
    ['ｯ', 'ッ--'],
    ['ｰ', 'ー--'],
    ['ｱ', 'ア--'],
    ['ｲ', 'イ--'],
    ['ｳ', 'ウヴ-'],
    ['ｴ', 'エ--'],
    ['ｵ', 'オ--'],
    ['ｶ', 'カガ-'],
    ['ｷ', 'キギ-'],
    ['ｸ', 'クグ-'],
    ['ｹ', 'ケゲ-'],
    ['ｺ', 'コゴ-'],
    ['ｻ', 'サザ-'],
    ['ｼ', 'シジ-'],
    ['ｽ', 'スズ-'],
    ['ｾ', 'セゼ-'],
    ['ｿ', 'ソゾ-'],
    ['ﾀ', 'タダ-'],
    ['ﾁ', 'チヂ-'],
    ['ﾂ', 'ツヅ-'],
    ['ﾃ', 'テデ-'],
    ['ﾄ', 'トド-'],
    ['ﾅ', 'ナ--'],
    ['ﾆ', 'ニ--'],
    ['ﾇ', 'ヌ--'],
    ['ﾈ', 'ネ--'],
    ['ﾉ', 'ノ--'],
    ['ﾊ', 'ハバパ'],
    ['ﾋ', 'ヒビピ'],
    ['ﾌ', 'フブプ'],
    ['ﾍ', 'ヘベペ'],
    ['ﾎ', 'ホボポ'],
    ['ﾏ', 'マ--'],
    ['ﾐ', 'ミ--'],
    ['ﾑ', 'ム--'],
    ['ﾒ', 'メ--'],
    ['ﾓ', 'モ--'],
    ['ﾔ', 'ヤ--'],
    ['ﾕ', 'ユ--'],
    ['ﾖ', 'ヨ--'],
    ['ﾗ', 'ラ--'],
    ['ﾘ', 'リ--'],
    ['ﾙ', 'ル--'],
    ['ﾚ', 'レ--'],
    ['ﾛ', 'ロ--'],
    ['ﾜ', 'ワ--'],
    ['ﾝ', 'ン--']
]);

const VOWEL_TO_KANA_MAPPING = new Map([
    ['a', 'ぁあかがさざただなはばぱまゃやらゎわヵァアカガサザタダナハバパマャヤラヮワヵヷ'],
    ['i', 'ぃいきぎしじちぢにひびぴみりゐィイキギシジチヂニヒビピミリヰヸ'],
    ['u', 'ぅうくぐすずっつづぬふぶぷむゅゆるゥウクグスズッツヅヌフブプムュユルヴ'],
    ['e', 'ぇえけげせぜてでねへべぺめれゑヶェエケゲセゼテデネヘベペメレヱヶヹ'],
    ['o', 'ぉおこごそぞとどのほぼぽもょよろをォオコゴソゾトドノホボポモョヨロヲヺ'],
    ['', 'のノ']
]);

const KANA_TO_VOWEL_MAPPING: Map<string, string> = (() => {
    const map = new Map();
    for (const [vowel, characters] of VOWEL_TO_KANA_MAPPING) {
        for (const character of characters) {
            map.set(character, vowel);
        }
    }
    return map;
})();

export function isCodePointInRange(codePoint: number, [min, max]: number[]): boolean {
    return (codePoint >= min && codePoint <= max);
}

export function isCodePointInRanges(codePoint: number, ranges: number[][]) {
    for (const [min, max] of ranges) {
        if (codePoint >= min && codePoint <= max) {
            return true;
        }
    }
    return false;
}

export function isCodePointKanji(codePoint: number) {
    return isCodePointInRanges(codePoint, CJK_UNIFIED_IDEOGRAPHS_RANGES);
}

export function isCodePointKana(codePoint: number) {
    return isCodePointInRanges(codePoint, KANA_RANGES);
}

export function isCodePointJapanese(codePoint: number) {
    return isCodePointInRanges(codePoint, JAPANESE_RANGES);
}

// String testing functions

export function isStringEntirelyKana(str: string) {
    if (str.length === 0) { return false; }
    for (const c of str) {
        if (!isCodePointInRanges(c.codePointAt(0), KANA_RANGES)) {
            return false;
        }
    }
    return true;
}

export function isStringPartiallyJapanese(str: string) {
    if (str.length === 0) { return false; }
    for (const c of str) {
        if (isCodePointInRanges(c.codePointAt(0), JAPANESE_RANGES)) {
            return true;
        }
    }
    return false;
}

// Mora functions

export function isMoraPitchHigh(moraIndex: number, pitchAccentPosition: number) {
    switch (pitchAccentPosition) {
        case 0: return (moraIndex > 0);
        case 1: return (moraIndex < 1);
        default: return (moraIndex > 0 && moraIndex < pitchAccentPosition);
    }
}

export function getKanaMorae(text: string) {
    const morae = [];
    let i;
    for (const c of text) {
        if (SMALL_KANA_SET.has(c) && (i = morae.length) > 0) {
            morae[i - 1] += c;
        } else {
            morae.push(c);
        }
    }
    return morae;
}

export function getProlongedHiragana(previousCharacter: string) {
    switch (KANA_TO_VOWEL_MAPPING.get(previousCharacter)) {
        case 'a': return 'あ';
        case 'i': return 'い';
        case 'u': return 'う';
        case 'e': return 'え';
        case 'o': return 'う';
        default: return null;
    }
}

// Conversion functions

export function convertToKana(text: string) {
    //return _getWanakana().toKana(text);
}

export function convertKatakanaToHiragana(text: string): string {
    let result = '';
    const offset = (HIRAGANA_CONVERSION_RANGE[0] - KATAKANA_CONVERSION_RANGE[0]);
    for (let char of text) {
        const codePoint = char.codePointAt(0);
        if (codePoint === KATAKANA_SMALL_KA_CODE_POINT || codePoint === KATAKANA_SMALL_KE_CODE_POINT) {
            // No change
        } else if (codePoint === KANA_PROLONGED_SOUND_MARK_CODE_POINT) {
            if (result.length > 0) {
                const char2 = getProlongedHiragana(result[result.length - 1]);
                if (char2 !== null) { char = char2; }
            }
        } else if (isCodePointInRange(codePoint, KATAKANA_CONVERSION_RANGE)) {
            char = String.fromCodePoint(codePoint + offset);
        }
        result += char;
    }
    return result;
}

export function convertHiraganaToKatakana(text: string): string {
    let result = '';
    const offset = (KATAKANA_CONVERSION_RANGE[0] - HIRAGANA_CONVERSION_RANGE[0]);
    for (let char of text) {
        const codePoint = char.codePointAt(0);
        if (isCodePointInRange(codePoint, HIRAGANA_CONVERSION_RANGE)) {
            char = String.fromCodePoint(codePoint + offset);
        }
        result += char;
    }
    return result;
}

export function convertToRomaji(text: string) {
    //const wanakana = _getWanakana();
    //return wanakana.toRomaji(text);
}

export function convertReading(expression: string, reading: string, readingMode: string) {
    switch (readingMode) {
        case 'hiragana':
            return convertKatakanaToHiragana(reading);
        case 'katakana':
            return convertHiraganaToKatakana(reading);
        case 'romaji':
            if (reading) {
                return convertToRomaji(reading);
            } else {
                if (isStringEntirelyKana(expression)) {
                    return convertToRomaji(expression);
                }
            }
            return reading;
        case 'none':
            return '';
        default:
            return reading;
    }
}

export function convertNumericToFullWidth(text: string) {
    let result = '';
    for (const char of text) {
        let c = char.codePointAt(0);
        if (c >= 0x30 && c <= 0x39) { // ['0', '9']
            c += 0xff10 - 0x30; // 0xff10 = '0' full width
            result += String.fromCodePoint(c);
        } else {
            result += char;
        }
    }
    return result;
}

export function convertHalfWidthKanaToFullWidth(text: string, sourceMap = null) {
    let result = '';

    // This function is safe to use charCodeAt instead of codePointAt, since all
    // the relevant characters are represented with a single UTF-16 character code.
    for (let i = 0, ii = text.length; i < ii; ++i) {
        const c = text[i];
        const mapping = HALFWIDTH_KATAKANA_MAPPING.get(c);
        if (typeof mapping !== 'string') {
            result += c;
            continue;
        }

        let index = 0;
        switch (text.charCodeAt(i + 1)) {
            case 0xff9e: // dakuten
                index = 1;
                break;
            case 0xff9f: // handakuten
                index = 2;
                break;
        }

        let c2 = mapping[index];
        if (index > 0) {
            if (c2 === '-') { // invalid
                index = 0;
                c2 = mapping[0];
            } else {
                ++i;
            }
        }

        if (sourceMap !== null && index > 0) {
            sourceMap.combine(result.length, 1);
        }
        result += c2;
    }

    return result;
}

export function convertAlphabeticToKana(text: string, sourceMap = null) {
    let part = '';
    let result = '';

    for (const char of text) {
        // Note: 0x61 is the character code for 'a'
        let c = char.codePointAt(0);
        if (c >= 0x41 && c <= 0x5a) { // ['A', 'Z']
            c += (0x61 - 0x41);
        } else if (c >= 0x61 && c <= 0x7a) { // ['a', 'z']
            // NOP; c += (0x61 - 0x61);
        } else if (c >= 0xff21 && c <= 0xff3a) { // ['A', 'Z'] fullwidth
            c += (0x61 - 0xff21);
        } else if (c >= 0xff41 && c <= 0xff5a) { // ['a', 'z'] fullwidth
            c += (0x61 - 0xff41);
        } else if (c === 0x2d || c === 0xff0d) { // '-' or fullwidth dash
            c = 0x2d; // '-'
        } else {
            if (part.length > 0) {
                result += _convertAlphabeticPartToKana(part, sourceMap, result.length);
                part = '';
            }
            result += char;
            continue;
        }
        part += String.fromCodePoint(c);
    }

    if (part.length > 0) {
        result += _convertAlphabeticPartToKana(part, sourceMap, result.length);
    }
    return result;
}

function _convertAlphabeticPartToKana(text: string, sourceMap, sourceMapStart) {
    const wanakana = this._getWanakana();
    const result = wanakana.toHiragana(text);

    // Generate source mapping
    if (sourceMap !== null) {
        let i = 0;
        let resultPos = 0;
        const ii = text.length;
        while (i < ii) {
            // Find smallest matching substring
            let iNext = i + 1;
            let resultPosNext = result.length;
            while (iNext < ii) {
                const t = wanakana.toHiragana(text.substring(0, iNext));
                if (t === result.substring(0, t.length)) {
                    resultPosNext = t.length;
                    break;
                }
                ++iNext;
            }

            // Merge characters
            const removals = iNext - i - 1;
            if (removals > 0) {
                sourceMap.combine(sourceMapStart, removals);
            }
            ++sourceMapStart;

            // Empty elements
            const additions = resultPosNext - resultPos - 1;
            for (let j = 0; j < additions; ++j) {
                sourceMap.insert(sourceMapStart, 0);
                ++sourceMapStart;
            }

            i = iNext;
            resultPos = resultPosNext;
        }
    }

    return result;
}

export function distributeFurigana(expression: string, reading: string) {
    if (!reading || reading === expression) {
        // Same
        return [{ furigana: '', text: expression }];
    }

    let isAmbiguous = false;
    const segmentize = (reading2, groups) => {
        if (groups.length === 0 || isAmbiguous) {
            return [];
        }

        const group = groups[0];
        if (group.mode === 'kana') {
            if (convertKatakanaToHiragana(reading2).startsWith(convertKatakanaToHiragana(group.text))) {
                const readingLeft = reading2.substring(group.text.length);
                const segs = segmentize(readingLeft, groups.splice(1));
                if (segs) {
                    return [{ text: group.text, furigana: '' }].concat(segs);
                }
            }
        } else {
            let foundSegments = null;
            for (let i = reading2.length; i >= group.text.length; --i) {
                const readingUsed = reading2.substring(0, i);
                const readingLeft = reading2.substring(i);
                const segs = segmentize(readingLeft, groups.slice(1));
                if (segs) {
                    if (foundSegments !== null) {
                        // more than one way to segmentize the tail, mark as ambiguous
                        isAmbiguous = true;
                        return null;
                    }
                    foundSegments = [{ text: group.text, furigana: readingUsed }].concat(segs);
                }
                // there is only one way to segmentize the last non-kana group
                if (groups.length === 1) {
                    break;
                }
            }
            return foundSegments;
        }
    };

    const groups = [];
    let modePrev = null;
    for (const c of expression) {
        const codePoint = c.codePointAt(0);
        const modeCurr = isCodePointKanji(codePoint) || codePoint === ITERATION_MARK_CODE_POINT ? 'kanji' : 'kana';
        if (modeCurr === modePrev) {
            groups[groups.length - 1].text += c;
        } else {
            groups.push({ mode: modeCurr, text: c });
            modePrev = modeCurr;
        }
    }

    const segments = segmentize(reading, groups);
    if (segments && !isAmbiguous) {
        return segments;
    }

    // Fallback
    return [{ furigana: reading, text: expression }];
}

export function distributeFuriganaInflected(expression: string, reading: string, source: string) {
    const output = [];

    let stemLength = 0;
    const shortest = Math.min(source.length, expression.length);
    const sourceHiragana = convertKatakanaToHiragana(source);
    const expressionHiragana = convertKatakanaToHiragana(expression);
    while (stemLength < shortest && sourceHiragana[stemLength] === expressionHiragana[stemLength]) {
        ++stemLength;
    }
    const offset = source.length - stemLength;

    const stemExpression = source.substring(0, source.length - offset);
    const stemReading = reading.substring(
        0,
        offset === 0 ? reading.length : reading.length - expression.length + stemLength
    );
    for (const segment of distributeFurigana(stemExpression, stemReading)) {
        output.push(segment);
    }

    if (stemLength !== source.length) {
        output.push({ text: source.substring(stemLength), furigana: '' });
    }

    return output;
}

const simpleJapaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/g;

export function isStringContainsJapanese(text: string): boolean {
    return simpleJapaneseRegex.test(text);
}

export function removeJapaneseChars(text: string): string {
    return text.replace(simpleJapaneseRegex, '');
}

const kanjiRegexp = /[\u4E00-\u9FFF]/g;
export function extractKanji(text: string) {
    return [...text.matchAll(kanjiRegexp)].map(m => m[0]);
}

const hiraganaRegexp = /[\u3040-\u309F]/g;
export function extractHiragana(text: string) {
    return [...text.matchAll(hiraganaRegexp)].map(m => m[0]);
}

const katakanaRegexp = /[\u30A0-\u30FF]/g;
export function extractKatakana(text: string) {
    return [...text.matchAll(katakanaRegexp)].map(m => m[0]);
}

const kanaRegexp = /[\u3040-\u309F\u30A0-\u30FF]/g;
export function extractKana(text: string) {
    return [...text.matchAll(kanaRegexp)].map(m => m[0]);
}