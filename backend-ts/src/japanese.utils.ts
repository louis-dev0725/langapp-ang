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

function isCodePointInRange(codePoint: number, [min, max]: number[]): boolean {
    return (codePoint >= min && codePoint <= max);
}

function isCodePointInRanges(codePoint, ranges) {
    for (const [min, max] of ranges) {
        if (codePoint >= min && codePoint <= max) {
            return true;
        }
    }
    return false;
}

function isCodePointKanji(codePoint) {
    return isCodePointInRanges(codePoint, CJK_UNIFIED_IDEOGRAPHS_RANGES);
}

function isCodePointKana(codePoint) {
    return isCodePointInRanges(codePoint, KANA_RANGES);
}

function isCodePointJapanese(codePoint) {
    return isCodePointInRanges(codePoint, JAPANESE_RANGES);
}

export function getProlongedHiragana(previousCharacter) {
    switch (KANA_TO_VOWEL_MAPPING.get(previousCharacter)) {
        case 'a': return 'あ';
        case 'i': return 'い';
        case 'u': return 'う';
        case 'e': return 'え';
        case 'o': return 'う';
        default: return null;
    }
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