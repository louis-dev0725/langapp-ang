import {FormDetectionRules as FormDetectionReasons, Rules as Reasons} from './form.detection.rules';

export class FormDetection {
    public reasons: any;

    ruleTypes = new Map([
        ['v1',    0b0000001], // Verb ichidan
        ['v5',    0b0000010], // Verb godan
        ['vs',    0b0000100], // Verb suru
        ['vk',    0b0001000], // Verb kuru
        ['adj-i', 0b0010000], // Adjective i
        ['iru',   0b0100000] // Intermediate -iru endings for progressive or perfect tense
    ]);

    constructor() {
        this.reasons = this.normalizeReasons(FormDetectionReasons);
    }

    deinflect(source) {
        const results = [{
            source,
            term: source,
            rules: 0,
            reasons: []
        }];
        for (let i = 0; i < results.length; ++i) {
            const {rules, term, reasons} = results[i];
            for (const [reason, variants] of this.reasons) {
                for (const [kanaIn, kanaOut, rulesIn, rulesOut] of variants) {
                    if (
                        (rules !== 0 && (rules & rulesIn) === 0) ||
                        !term.endsWith(kanaIn) ||
                        (term.length - kanaIn.length + kanaOut.length) <= 0
                    ) {
                        continue;
                    }

                    results.push({
                        source,
                        term: term.substring(0, term.length - kanaIn.length) + kanaOut,
                        rules: rulesOut,
                        reasons: [reason, ...reasons],
                    });
                }
            }
        }
        return results;
    }

    normalizeReasons(reasons : Reasons) {
        const normalizedReasons = [];
        for (const [reason, reasonInfo] of Object.entries(reasons)) {
            const variants = [];
            for (const {kanaIn, kanaOut, rulesIn, rulesOut} of reasonInfo) {
                variants.push([
                    kanaIn,
                    kanaOut,
                    this.rulesToRuleFlags(rulesIn),
                    this.rulesToRuleFlags(rulesOut)
                ]);
            }
            normalizedReasons.push([reason, variants]);
        }
        return normalizedReasons;
    }

    rulesToRuleFlags(rules) {
        const ruleTypes = this.ruleTypes;
        let value = 0;
        for (const rule of rules) {
            const ruleBits = ruleTypes.get(rule);
            if (typeof ruleBits === 'undefined') { continue; }
            value |= ruleBits;
        }
        return value;
    }
}