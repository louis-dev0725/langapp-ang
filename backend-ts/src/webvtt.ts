const webvtt = require('node-webvtt');

export interface WebVTT {
    valid: boolean;
    cues: Cue[];
}

export interface Cue {
    identifier: string;
    start: number;
    end: number;
    text: string;
    styles: string;
}

function stripTags(string: string) {
    return string.replace(/<[^>]*>?/gm, '');
}

function removeZeroWidthSpaces(string: string) {
    return string.replace(/[\u200B-\u200D\uFEFF]/g, '');
}

export function parseWebVTT(text: string): WebVTT {
    let result = webvtt.parse(text, { meta: true, strict: false });
    let cues: Cue[] = result.cues;
    let newCues = [];

    for (let i = 0; i < cues.length; i++) {
        cues[i].text = removeZeroWidthSpaces(stripTags(cues[i].text)).trim();
        if (cues[i].text == cues[i - 1]?.text && (Math.abs(cues[i].start - cues[i - 1]?.end) < 0.1 || Math.abs(cues[i].start - cues[i - 1]?.start) < 0.1)) {
            cues[i - 1].end = cues[i].end;
        }
        else {
            newCues.push(cues[i]);
        }
    }
    result.cues = newCues;

    return result;
}