import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { groupBy, keyBy, map, mapValues, orderBy, reduceRight, sortBy, split, sum, sumBy, uniq } from "lodash";
import { Repository } from "typeorm";
import { Content } from "./entities/Content";
import { DictionaryType, DictionaryWord } from "./entities/DictionaryWord";
import { DictionaryWordRepository } from "./entities/DictionaryWordRepository";
import { JapaneseKanji } from "./entities/JapaneseKanji";
import { JapaneseWord } from "./entities/JapaneseWord";
import { extractHiragana, extractKana, extractKanji, extractKatakana } from "./japanese.utils";
import { JumanppJumandicClient as JumanppClient } from './proto/jumandic-svc_grpc_pb';
import { AnalysisRequest } from "./proto/jumandic-svc_pb";
import { JumanMorpheme, JumanSentence } from "./proto/juman_pb";

@Injectable()
export class AnalyzeJapaneseService {
    constructor(
        private dictionaryWordRepository: DictionaryWordRepository,
        private jumanppClient: JumanppClient,
    ) {
    }

    async jumanCall(request: AnalysisRequest): Promise<JumanSentence> {
        // promisify doesn't work in that case https://github.com/grpc/grpc-node/issues/323
        return new Promise((resolve, reject) => {
            this.jumanppClient.juman(request, (error, response) => {
                if (error) {
                    reject(error);
                }
                resolve(response);
            })
        });
    }

    protected async analyzeViaJumanInternal(text: string) {
        //console.log('Anayze', text.length, (new TextEncoder).encode(text).length);
        //console.log('Call Juman');
        text = text.replace(/\s/g, ' ');
        let request = new AnalysisRequest();
        request.setSentence(text);

        let resultTmp = await this.jumanCall(request);

        let mecabResult = resultTmp.toObject();
        let morphemesList = mecabResult.morphemesList;

        //console.log('Called Juman');

        return morphemesList;
    }

    async analyzeViaJuman(text: string) {
        if (text.length < 1024) {
            return await this.analyzeViaJumanInternal(text);
        }
        let chunks = this.splitString(text);
        let result: JumanMorpheme.AsObject[] = [];
        for (let chunk of chunks) {
            result.push(... await this.analyzeViaJumanInternal(chunk));
        }

        return result;
    }

    protected splitString(text: string) {
        return [...text.matchAll(/(?<p>[^]{900,1024}(?=[ぁ-ん\n])|[^]{1,1024}$)/g)].map(i => i[0]);
    }

    getBaseforms(current: JumanMorpheme.AsObject): string[] {
        let baseforms: string[] = [];
        if (current.baseform) {
            if (current.baseform.length > 1 && current.baseform.substr(-1) == 'だ') {
                baseforms.push(current.baseform.substr(0, current.baseform.length - 1));
                if (current.stringPos.conjType == 'デアル列タ形') {
                    baseforms.push(current.baseform.substr(0, current.baseform.length - 1) + 'である');
                }
            }
            else if (current.baseform.length > 2 && current.baseform.substr(-2) == 'する') {
                baseforms.push(current.baseform.substr(0, current.baseform.length - 2));
            }
            else if (current.surface != current.baseform) {
                baseforms.push(current.baseform);
            }
        }

        for (let feature of current.featuresList) {
            if (['代表表記', '可能動詞'].indexOf(feature.key) !== -1 && feature.value) {
                let value = /^([^/]*)/.exec(feature.value)[0]; // for example take "書く" from "書く/かく"
                if (baseforms.indexOf(value) == -1 && value != current.surface) {
                    baseforms.push(value);
                }
            }
            if (feature.key == 'カテゴリ' && feature.value == '数量') {
                let cleaned = current.surface.replace(/\d+/g, '');
                if (current.surface != cleaned && cleaned.length > 0) {
                    baseforms.push(cleaned);
                }
            }
        }

        return baseforms;
    }

    async fillLevelForContent(item: Content) {
        let result = await this.determineLevel(item.cleanText);
        item.dataJson.wordsStats = result.wordsStats;
        item.dataJson.kanjiStats = result.kanjiStats;
        item.dataJson.otherStats = result.otherStats;
        item.dataJson.levelSource = result.levelSource;
        item.level = result.level;

        let matchLevelInTitle = item.title.match(/(N(?<m1>\d).*(J[LPT]{3}|文法|Grammar|grammar|日本語能力試験)|(J[LPT]{3}|文法|Grammar|grammar|日本語能力試験).*N(?<m2>\d))/);
        if (matchLevelInTitle) {
            let levelInTitle = Number(matchLevelInTitle.groups['m1'] ?? matchLevelInTitle.groups['m2']);
            if (levelInTitle >= 1 && levelInTitle <= 5) {
                item.level = levelInTitle;
                item.dataJson.levelSource = "title";
            }
        }
    }

    async determineLevel(text: string, morphemesList?: JumanMorpheme.AsObject[]) {
        let levelSource = 'none';
        if (!morphemesList) {
            morphemesList = await this.analyzeViaJuman(text);
        }
        let wordQueries = morphemesList.filter(m => m.stringPos.pos != '特殊').map(m => this.getBaseforms(m)?.[0] ?? m.surface);
        let wordsFromDb = <JapaneseWord[]>await this.dictionaryWordRepository.findByExactQueries(DictionaryType.JapaneseWords, uniq(wordQueries));
        let wordsStats = this.levelStatsForWords(wordQueries, wordsFromDb);

        let kanjiQueries = extractKanji(text);
        let kanjiFromDb = <JapaneseKanji[]>await this.dictionaryWordRepository.findByExactQueries(DictionaryType.JapaneseKanji, uniq(kanjiQueries));
        let kanjiStats = this.levelStatsForWords(kanjiQueries, kanjiFromDb);

        let hiraganaCount = extractHiragana(text).length;
        let katakanaCount = extractKatakana(text).length;
        let totalCount = kanjiQueries.length + hiraganaCount + katakanaCount;
        let otherStats = {
            hiraganaPercent: hiraganaCount / totalCount,
            katakanaPercent: katakanaCount / totalCount,
            kanaPercent: (hiraganaCount + katakanaCount) / totalCount,
        };

        let level: number;
        if (wordsStats.jlptLevel >= 3 && otherStats.kanaPercent > 0.9 && otherStats.hiraganaPercent > 0.6) {
            level = 5;
            levelSource = 'kanaPercent';
        }
        //else if (!isNaN(wordsStats.jlptLevel) && !isNaN(kanjiStats.jlptLevel)) {
        //    let level = Math.min(wordsStats.jlptLevel, kanjiStats.jlptLevel);
        //}
        else if (!isNaN(wordsStats.jlptLevel)) {
            level = wordsStats.jlptLevel;
            levelSource = 'wordsStats';
        }
        else {
            level = -2;
        }

        return { level, wordsStats, kanjiStats, otherStats, levelSource };
    }

    approximateJlptLevel(wordFromDb: JapaneseWord): number {
        if (!wordFromDb.data.frequencyPmw) {
            return 0;
        }
        // Query to calculate percentile per each JLPT level: select (data->>'jlptLevel')::int "jlptLevel", k, percentile_disc(k) within group (order by (data->'frequencyPmw')::float) from dictionary_word dw, generate_series(0.1, 1, 0.1) as k where type = 1 and (data->'frequencyPmw')::float > 0 group by 1, k order by 1 asc;
        let levels = {
            1: 1.5868096,
            2: 15.1702824,
            3: 23.1043305,
            4: 88.9186937,
            5: 147.8696273,
        };
        let wordFrequencyPmw = wordFromDb.data.frequencyPmw;
        for (let [level, frequencyPmw] of Object.entries(levels).reverse()) {
            if (wordFrequencyPmw > frequencyPmw) {
                return Number(level);
            }
        }

        return 0;
    }

    protected levelStatsForWords(wordsQueries: string[], wordsFromDb: DictionaryWord[]) {
        //let wordsIndex = keyBy(wordsQueries, w => w.link);
        let countUsages = mapValues(groupBy(wordsQueries, w => w), l => l.length);
        //let fromDbByQuery0 = keyBy(wordsFromDb, w => w.query[0]);
        //let fromDbByQuery1 = keyBy(wordsFromDb, w => w.query[0]);
        let absoluteStats = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };
        let coverageStats = { ...absoluteStats };
        let wordList = {};
        let rankStats = {};
        let allList = [];

        /*for (let wordFromDb of wordsFromDb) {
            if (wordFromDb.data.jlptLevel) {
                levelStats[wordFromDb.data.jlptLevel]++;
            }
        }*/
        for (let [word, count] of Object.entries(countUsages)) {
            //let wordFromDb = fromDbByQuery0[word] ?? fromDbByQuery1[word];
            //if (!wordFromDb) {
            //    wordFromDb = wordsFromDb.find(w => w.query.indexOf(word) !== -1);
            //}
            let matchedWords = wordsFromDb.filter(w => w.query.indexOf(word) !== -1);
            let wordFromDb: DictionaryWord;
            let matchedWords2 = matchedWords.filter(w => w.query[0] == word);
            if (!wordFromDb && matchedWords2.length == 1) {
                wordFromDb = matchedWords2[0];
            }
            if (!wordFromDb) {
                wordFromDb = orderBy(matchedWords, [w => (<JapaneseWord>w).data.frequencyPmw ?? 0, w => w.data.jlptLevel ?? 0], ['desc', 'desc'])?.[0];
            }
            if (!wordFromDb) {
                //console.log('Unable to find word in DB: ', word);
                continue;
            }
            if (JapaneseWord.sInstance(wordFromDb) && wordFromDb.data.frequencyRank) {
                rankStats[wordFromDb.data.frequencyRank] = (rankStats[wordFromDb.data.frequencyRank] ?? 0) + count;
                allList.push([word, wordFromDb.data]);
            }
            if (wordFromDb.data.jlptLevel) {
                absoluteStats[wordFromDb.data.jlptLevel] = (absoluteStats[wordFromDb.data.jlptLevel] ?? 0) + count;
                if (!wordList[wordFromDb.data.jlptLevel]) {
                    wordList[wordFromDb.data.jlptLevel] = [];
                }
                wordList[wordFromDb.data.jlptLevel].push(word);
            }
            else {
                let approximateLevel = this.approximateJlptLevel(<JapaneseWord>wordFromDb);
                absoluteStats[approximateLevel] = (absoluteStats[approximateLevel] ?? 0) + count;
                if (!wordList[approximateLevel + '_a']) {
                    wordList[approximateLevel + '_a'] = [];
                }
                wordList[approximateLevel + '_a'].push(word);
                //console.log('Unkown JLPT level: ', wordFromDb.id, word, 'approximateLevel', approximateLevel);
            }
        }
        let absoluteTotal = sum(Object.values(absoluteStats));
        let jlptLevel: number;
        for (let [level, count] of Object.entries(absoluteStats).reverse()) {
            coverageStats[level] = (coverageStats[Number(level) + 1] ?? 0) + (count / absoluteTotal);
            let minPercent = level == "5" ? 0.78 : 0.88;
            if (!jlptLevel && coverageStats[level] >= minPercent) {
                jlptLevel = Number(level);
            }
        }
        return { jlptLevel, absoluteStats, absoluteTotal, coverageStats, wordList, rankStats, /*allList*/ };
    }
}