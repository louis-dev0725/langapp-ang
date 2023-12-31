import { Logger, Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { AnalyzeJapaneseService } from './analyze.japanese.service';
import { DictionaryType, DictionaryWord } from './entities/DictionaryWord';
import { DictionaryWordRepository } from './entities/DictionaryWordRepository';
import { JapaneseWord } from './entities/JapaneseWord';
import { JapaneseWordData, Reading } from './entities/JapaneseWordData';
import { FormDetection } from './form.detection';
import { convertKatakanaToHiragana, distributeFurigana, distributeFuriganaInflected, isStringEntirelyKana } from './japanese.utils';
import { JumanppJumandicClient as JumanppClient } from './proto/jumandic-svc_grpc_pb';
import { AnalysisRequest } from './proto/jumandic-svc_pb';
import { JumanMorpheme, JumanSentence, JumanStringPos } from './proto/juman_pb';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, { timestamp: true });

  constructor(private dictionaryWordRepository: DictionaryWordRepository, private jumanppClient: JumanppClient, private analyzeJapanese: AnalyzeJapaneseService) {}

  async processText(originalText: string, clickedOffsetOriginal: number, requestedLanguages: string[], exactMatch: boolean = false): Promise<any> {
    let toReturn: ProcessTextResponse = new ProcessTextResponse();
    let allVariants: Variant[] = [];

    // requestedLanguages = ['en'];

    if (exactMatch) {
      let text = originalText.replace(/\s/g, '');
      allVariants.push({
        value: text,
        isBaseform: false,
        offsetStart: 0,
        offsetEnd: originalText.length,
        reading: '',
        reasons: [],
      });
    } else {
      this.logger.log('Start');
      let morphemesList = await this.analyzeJapanese.analyzeViaJuman(originalText);
      this.logger.log('Got response from juman');

      this.logger.log('Lookahead');
      allVariants = this.lookahead(morphemesList, clickedOffsetOriginal);
    }

    if (allVariants.length == 0) {
      return { success: false };
    }

    let queries = allVariants.map((v) => (v.valueHiragana = convertKatakanaToHiragana(v.value)));

    this.logger.log('Query words in DB');
    this.logger.log(queries);
    let wordsFromDb = <JapaneseWord[]>await this.dictionaryWordRepository.findByExactQueries(DictionaryType.JapaneseWords, queries);
    this.logger.log('Done, found ' + wordsFromDb.length + ' words.');

    let resultWords: JapaneseResultItem[] = [];
    for (let word of wordsFromDb) {
      let variant = allVariants.find((v) => word.query.indexOf(v.valueHiragana) !== -1);
      if (variant) {
        resultWords.push({
          id: word.id,
          type: word.type,
          ...word.data,
          ...variant,
        });
      } else {
        this.logger.log('Strange. Result from DB "' + JSON.stringify(word.query) + ' was not found in variants.');
      }
    }

    toReturn.success = resultWords.length > 0;
    toReturn.words = resultWords;

    let hasMeaningsInRequestedLanguages = toReturn.words.filter((w) => w.meanings.filter((m) => requestedLanguages.indexOf(m.lang) !== -1).length > 0).length > 0;
    if (!hasMeaningsInRequestedLanguages) {
      requestedLanguages.push('en');
    }

    for (let word of toReturn.words) {
      /*
      word.translations = [];
      word.partOfSpeech = [];
      if (word?.sourceData?.sense) {
        for (let sense of word?.sourceData?.sense) {
          word.partOfSpeech.push(...sense.partOfSpeech);
          for (let translation of sense.gloss) {
            if (languages.indexOf(translation.lang) !== -1) {
              word.translations.push(translation);
            }
          }
        }
      }
      word.partOfSpeech = [...new Set(word.partOfSpeech)]; // unique values
      */
      /*word.translations.sort((a, b) => {
        return languages.indexOf(a.lang) - languages.indexOf(b.lang);
      });*/
      word.meanings = word.meanings
        .filter((m) => !m.isOther && requestedLanguages.indexOf(m.lang) !== -1)
        .sort((a, b) => {
          return requestedLanguages.indexOf(a.lang) - requestedLanguages.indexOf(b.lang);
        });

      /*word.readings = [];
      word.currentReadingIsCommon = false;
      if (word?.sourceData?.kana) {
        let isKanaWord = isStringEntirelyKana(word.value);
        let addedAdditionalKanaOnly = false;
        let kanjiList = word?.sourceData?.kanji;
        if (kanjiList.length == 0) {
          kanjiList.push({ text: '', common: true });
        }
        for (let kanjiTmp of kanjiList) {
          for (let kanaTmp of word?.sourceData?.kana) {
            if (kanaTmp.appliesToKanji.indexOf('*') !== -1 || kanaTmp.appliesToKanji.indexOf(kanjiTmp.text) !== -1) {
              if (!addedAdditionalKanaOnly && kanjiTmp != '' && isKanaWord && kanaTmp.text == word.value) {
                word.readings.push({
                  text: kanaTmp.text,
                  common: kanaTmp.common,
                  furigana: [
                    { furigana: '', text: kanaTmp.text }
                  ],
                  current: true
                });
                if (kanaTmp.common && !word.currentReadingIsCommon) {
                  word.currentReadingIsCommon = true;
                }
                addedAdditionalKanaOnly = true;
              }

              let reading: any = { kanji: kanjiTmp.text, kana: kanaTmp.text, common: kanjiTmp.common && kanaTmp.common };
              reading.furigana = distributeFurigana(reading.kanji, reading.kana);
              reading.current = word.value == reading.kanji || (reading.kanji == '' && word.value == reading.kana);
              if (reading.current && reading.common && !word.currentReadingIsCommon) {
                word.currentReadingIsCommon = true;
              }
              word.readings.push(reading);
            }
          }
        }
      }*/

      let mainReading: Reading = null;

      word.currentReadingIsCommon = false;
      let hasCurrentReading = false;
      for (let reading of word.readings) {
        reading.current = reading.kanji == word.value || (reading.kanji == '' && word.value == reading.kana);
        if (reading.current) {
          hasCurrentReading = true;
          if (mainReading == null || !mainReading.common) {
            mainReading = reading;
          }
        }
        if (reading.current && reading.common && !word.currentReadingIsCommon) {
          word.currentReadingIsCommon = true;
        }
      }
      let isKanaWord = isStringEntirelyKana(word.value);
      if (!hasCurrentReading && isKanaWord) {
        for (let reading of word.readings) {
          reading.current = word.value == reading.kana;
          if (reading.current) {
            hasCurrentReading = true;
            if (mainReading == null || !mainReading.common) {
              mainReading = reading;
            }
          }
          //if (reading.current && reading.common && !word.currentReadingIsCommon) {
          //  word.currentReadingIsCommon = true;
          //}
        }
      }

      if (mainReading == null) {
        mainReading = word.readings[0];
      }
      if (mainReading) {
        mainReading.currentMain = true;
      }
    }

    toReturn.words.sort((a, b) => {
      // Same partOfSpeech (currently checks only particles)
      let aIsParticle = a.reasons?.[0]?.pos == '助詞' && a.partOfSpeech.some((p) => p.value == 'prt') ? 1 : 0;
      let bIsParticle = b.reasons?.[0]?.pos == '助詞' && b.partOfSpeech.some((p) => p.value == 'prt') ? 1 : 0;

      let r = bIsParticle - aIsParticle;
      if (r != 0) {
        console.log(a.readings[0].kanji, aIsParticle);
        console.log(b.readings[0].kanji, bIsParticle);
      }
      if (r == 0) {
        r = b.value.length - a.value.length;
        if (r == 0) {
          r = (a.isBaseform ? 1 : 0) - (b.isBaseform ? 1 : 0);
          if (r == 0) {
            r = (b.currentReadingIsCommon ? 1 : 0) - (a.currentReadingIsCommon ? 1 : 0);
            if (r == 0) {
              r = b.frequencyPmw > a.frequencyPmw ? 1 : -1;
            }
          }
        }
      }
      return r;
    });

    if (resultWords[0]) {
      toReturn.offsetStart = resultWords[0].offsetStart;
      toReturn.offsetEnd = resultWords[0].offsetEnd;
    }

    return toReturn;
  }

  lookahead(morphemesList: JumanMorpheme.AsObject[], clickedOffset: number): Variant[] {
    let allVariants: Variant[] = [];
    let variants: Variant[] = [];

    let wordStartOffset = -1;
    let wordInfections = [];
    let currentWordInfections = [];
    let insideClickedWord = false;

    let currentOffset = 0;
    let nextOffset = 0;
    for (let i = 0; i < morphemesList.length; i++) {
      let current = morphemesList[i];
      currentOffset = nextOffset;
      nextOffset = currentOffset + current.surface.length;
      // Skip until reached 10 letters before clicked offset
      if (nextOffset < clickedOffset - 10) {
        continue;
      }

      console.log(currentOffset, current);

      let currentPos = current.stringPos.pos;
      let isPartical = currentPos == '助詞';
      let isSuffix = currentPos == '接尾辞';
      let isVerb = currentPos == '動詞';
      let isPunctuation = currentPos == '特殊';
      if (!insideClickedWord) {
        insideClickedWord = currentOffset >= clickedOffset && currentOffset < nextOffset;
      }

      if (isPunctuation) {
        if (currentOffset > clickedOffset) {
          break;
        } else {
          // Reset varinats on punctuation
          variants = [];
          allVariants = [];
          //wordInfections = [];
          wordStartOffset = nextOffset;
          insideClickedWord = false;
          continue;
        }
      }

      // When word is ended
      if (!isSuffix) {
        // TODO: いる, ある, etc marked as verb not as suffix
        wordStartOffset = currentOffset;
        //wordInfections = [];
        insideClickedWord = false;
      }

      let currentOffsetEnd = currentOffset + current.surface.length;

      let variantsLength = variants.length;
      for (let vI = 0; vI < variantsLength; vI++) {
        let currentVariant = variants[vI];

        if (currentVariant.isBaseform) {
          continue;
        }
        let reasons = [];

        //if (isSuffix || isVerb) {
        //  reasons = [...currentVariant.reasons, current.stringPos];
        //}
        let offsetStart = currentVariant.offsetStart;
        let offsetEnd = currentOffsetEnd;
        // new object on purpose
        variants[vI] = {
          value: currentVariant.value + current.surface,
          reading: currentVariant.reading + current.reading,
          reasons,
          isBaseform: currentVariant.isBaseform,
          offsetStart,
          offsetEnd,
        };

        for (let baseformValue of this.analyzeJapanese.getBaseforms(current)) {
          variants.push({
            value: currentVariant.value + baseformValue,
            reading: currentVariant.reading + current.reading,
            reasons,
            isBaseform: true,
            offsetStart,
            offsetEnd,
          });
        }
      }

      //if (!isSuffix) {
      variants.push({
        value: current.surface,
        reading: current.reading,
        reasons: [current.stringPos],
        isBaseform: false,
        offsetStart: currentOffset,
        offsetEnd: currentOffsetEnd,
      });
      for (let baseformValue of this.analyzeJapanese.getBaseforms(current)) {
        variants.push({
          value: baseformValue,
          reading: current.reading,
          reasons: [current.stringPos],
          isBaseform: true,
          offsetStart: currentOffset,
          offsetEnd: currentOffsetEnd,
        });
      }
      //}

      for (let currentVariant of allVariants) {
        if (currentVariant.offsetStart >= wordStartOffset) {
          currentVariant.offsetEnd = currentOffsetEnd;
          currentVariant.reasons.unshift(current.stringPos);
        }
      }

      allVariants.push(...variants);

      // Stop after scanning 10 letters after clicked offset
      if (nextOffset > clickedOffset + 10) {
        break;
      }
    }

    // Only phrases that were clicked, with length 10 or less
    allVariants = allVariants.filter((v) => v.value.length <= 10 && v.offsetStart <= clickedOffset && v.offsetEnd > clickedOffset);

    return allVariants;
  }
}

interface Variant {
  value: string;
  valueHiragana?: string;
  reading: string;
  reasons: JumanStringPos.AsObject[];
  isBaseform: boolean;
  offsetStart: number;
  offsetEnd: number;
}

interface VariantsByValue {
  [key: string]: Variant;
}

type JapaneseResultItem = JapaneseWordData &
  Variant & {
    id: number;
    type: DictionaryType;
    currentReadingIsCommon?: boolean;
  };

class ProcessTextResponse {
  success: boolean;
  offsetStart: number;
  offsetEnd: number;
  words: JapaneseResultItem[];
}
