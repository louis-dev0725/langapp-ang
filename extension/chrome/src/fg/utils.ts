const japaneseRegex = /[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]/;

export function isStringContainsJapanese(string: string): boolean {
    return japaneseRegex.test(string);
}