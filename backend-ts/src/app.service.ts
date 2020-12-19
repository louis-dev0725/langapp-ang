import { Logger, Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictionaryWord } from './entities/DictionaryWord';
import { FormDetection } from './form.detection';
import { distributeFurigana, distributeFuriganaInflected, isStringEntirelyKana } from './japanese.utils';
import { JumanppJumandicClient as JumanppClient } from './proto/jumandic-svc_grpc_pb';
import { AnalysisRequest } from './proto/jumandic-svc_pb';
import { JumanMorpheme, JumanSentence, JumanStringPos } from './proto/juman_pb';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name, true);

  constructor(
    @InjectRepository(DictionaryWord)
    private dictionaryWordRepository: Repository<DictionaryWord>,
    private formDetection: FormDetection,
    private jumanppClient: JumanppClient,
  ) {
  }

  async callJuman(request: AnalysisRequest): Promise<JumanSentence> {
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

  async processText(originalText: string, clickedOffsetOriginal: number, languages: string[], exactMatch: boolean = false): Promise<any> {
    let toReturn: any = {};
    let allVariants: Variant[] = [];

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
    }
    else {
      let text = originalText.replace(/\s/g, ' ');
      this.logger.log('Start');

      this.logger.log('Send grpc request');
      let request = new AnalysisRequest();
      request.setSentence(text);

      let resultTmp = await this.callJuman(request);
      this.logger.log('Got response from grpc');

      this.logger.log('Response to object');
      let mecabResult = (resultTmp).toObject();

      this.logger.log('Look for click position');
      let morphemesList = mecabResult.morphemesList;
      let currentPosition = 0;
      let nextPosition;
      let clickedIndex;
      let clickedOffset = 0;
      for (let i = 0; i < morphemesList.length; i++) {
        //console.log(currentPosition, morphemesList[i], morphemesList[i].surface.length);
        nextPosition = currentPosition + morphemesList[i].surface.length;
        if (nextPosition > clickedOffsetOriginal) {
          clickedIndex = i;
          clickedOffset = currentPosition;
          break;
        }
        currentPosition = nextPosition;
      }

      if (clickedIndex === undefined) {
        return { success: false, error: 'Unable to find clickedIndex.' };
      }

      //this.logger.log(morphemesList);
      console.log('Clicked word', morphemesList[clickedIndex]);

      this.logger.log('Lookback');
      // Lookback
      let lookback = this.lookaround(morphemesList, clickedIndex, clickedOffset, -1, []);
      this.logger.log('Lookahead');
      // Lookahead
      let forLookaheadVariants = lookback.filter(v => !v.isBaseform);
      let lookahead = this.lookaround(morphemesList, clickedIndex, clickedOffset, +1, forLookaheadVariants);

      allVariants = [...lookback, ...lookahead];
      allVariants = allVariants.filter(v => v.value.length <= 10);

      this.logger.log('Done');
    }

    if (allVariants.length == 0) {
      return { success: true };
    }

    let queries = allVariants.map(v => v.value);

    this.logger.log('Query words in DB');
    this.logger.log(queries);
    let wordsFromDb = await this.dictionaryWordRepository.createQueryBuilder("words").where("query && ARRAY[:...queries]", { queries }).getMany();
    this.logger.log('Done, found ' + wordsFromDb.length + ' words.');

    let resultWords: (DictionaryWord & Variant)[] = [];
    for (let word of wordsFromDb) {
      let variant = allVariants.find(v => word.query.indexOf(v.value) !== -1);
      if (variant) {
        resultWords.push({
          ...word,
          ...variant
        });
      }
      else {
        this.logger.log('Strange. Result from DB "' + JSON.stringify(word.query) + " was not found in variants.");
      }
    }

    toReturn.success = true;
    toReturn.words = resultWords;

    for (let word of toReturn.words) {
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
      word.translations.sort((a, b) => {
        return languages.indexOf(a.lang) - languages.indexOf(b.lang);
      });

      word.readings = [];
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
            if (kanaTmp.appliesToKanji.indexOf('*') !== -1 || kanaTmp.appliesToKanji.indexOf(kanjiTmp.text)) {
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
      }
    }

    toReturn.words.sort((a, b) => {
      // Same partOfSpeech (currently checks only particles)
      let r = ((a.reasons?.[0]?.pos == "助詞" && a.partOfSpeech.indexOf('prt')) ? 1 : 0) - ((b.reasons?.[0]?.pos == "助詞" && b.partOfSpeech.indexOf('prt')) ? 1 : 0);
      if (r == 0) {
        r = b.value.length - a.value.length;
        if (r == 0) {
          r = (a.isBaseform ? 1 : 0) - (b.isBaseform ? 1 : 0);
          if (r == 0) {
            r = (b.currentReadingIsCommon ? 1 : 0) - (a.currentReadingIsCommon ? 1 : 0);
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

  lookaround(morphemesList: JumanMorpheme.AsObject[], clickedIndex: number, clickedOffset: number, direction: number = -1, startVariants: Variant[] = []): Variant[] {
    let allVariants: Variant[] = [];
    let variants: Variant[] = startVariants;
    let lookedLength = 0;
    let reachedTheWord = false;
    let addIndividualWords = true;
    let skipFirstAdd = direction == +1;
    // Lookback/lookahead
    for (let i = clickedIndex; i >= 0 && i < morphemesList.length; i = i + direction) {
      let current = morphemesList[i];
      let isPartical = current.stringPos.pos == "助詞";
      let isSuffix = current.stringPos.pos == "接尾辞";
      let isVerb = current.stringPos.pos == "動詞";
      let addToReasons = isSuffix || isVerb;
      if (direction == -1 && i != clickedIndex) {
        lookedLength += current.surface.length;
      }
      if (direction == +1 && isSuffix) {
        addIndividualWords = false;
      }
      if (!skipFirstAdd) {
        let offsetStart: number;
        let offsetEnd: number;
        let variantsLength = variants.length;
        for (let vI = 0; vI < variantsLength; vI++) {
          let currentVariant = variants[vI];
          if (direction == +1 && currentVariant.isBaseform) {
            continue;
          }
          let reasons;
          if (addToReasons) {
            if (direction == -1) {
              reasons = [current.stringPos, ...currentVariant.reasons];
            }
            else {
              reasons = [...currentVariant.reasons, current.stringPos];
            }
          }
          else {
            if (direction == -1) {
              reasons = currentVariant.reasons;
            } else {
              reasons = [];
            }
          }
          let value: string;
          let reading: string;
          let valuesWithBaseforms: string[] = [];
          if (direction == -1) {
            value = current.surface + currentVariant.value;
            reading = current.reading + currentVariant.reading;
            offsetStart = clickedOffset + direction * lookedLength;
            offsetEnd = currentVariant.offsetEnd;
          }
          else {
            if (!currentVariant.isBaseform && current.surface != current.baseform) {
              for (let baseformValue of this.getBaseforms(current)) {
                valuesWithBaseforms.push(currentVariant.value + baseformValue);
              }
            }
            value = currentVariant.value + current.surface;
            reading = currentVariant.reading + current.reading;
            offsetStart = currentVariant.offsetStart;
            offsetEnd = offsetStart + value.length;
          }
          // new object on purpose
          variants[vI] = {
            value,
            reading,
            reasons,
            isBaseform: currentVariant.isBaseform,
            offsetStart,
            offsetEnd,
          };

          for (let baseformValue of valuesWithBaseforms) {
            variants.push({
              value: baseformValue,
              reading,
              reasons,
              isBaseform: true,
              offsetStart,
              offsetEnd,
            });
          }
        }

        if (addIndividualWords && !reachedTheWord) {
          let offsetStart = clickedOffset + direction * lookedLength;
          let offsetEnd = offsetStart + current.surface.length; // Same for baseform
          variants.push({
            value: current.surface,
            reading: current.reading,
            reasons: [current.stringPos],
            isBaseform: false,
            offsetStart,
            offsetEnd,
          });
          if (current.surface != current.baseform) {
            for (let baseformValue of this.getBaseforms(current)) {
              variants.push({
                value: baseformValue,
                reading: current.reading,
                reasons: [current.stringPos],
                isBaseform: true,
                offsetStart,
                offsetEnd,
              });
            }
          }
        }
      }
      else {
        skipFirstAdd = false;
      }

      let nextIsPunctuation = morphemesList[i + direction]?.stringPos.pos == "特殊";
      if (nextIsPunctuation) {
        break;
      }

      if (!isSuffix) {
        if (lookedLength <= 10) {
          //if (!reachedTheWord || !isPartical) {}
          allVariants.push(...variants);
          reachedTheWord = true;
          //}
        }
        else {
          break;
        }
      }
      //console.log({ offset: direction * lookedLength, current, isSuffix, variants });
      if (direction == +1) {
        lookedLength += current.surface.length;
      }
    }
    allVariants.push(...variants);

    return allVariants;
  }

  getBaseforms(current: JumanMorpheme.AsObject): string[] {
    let baseforms: string[] = [];
    if (current.baseform.substr(-1) == 'だ') {
      baseforms.push(current.baseform.substr(0, current.baseform.length - 1));
      if (current.stringPos.conjType == 'デアル列タ形') {
        baseforms.push(current.baseform.substr(0, current.baseform.length - 1) + 'である');
      }
    }
    else if (current.baseform.substr(-2) == 'する') {
      baseforms.push(current.baseform.substr(0, current.baseform.length - 2));
    }
    else {
      baseforms.push(current.baseform);
    }

    for (let feature of current.featuresList) {
      let value = /^([^/]*)/.exec(feature.value)[0]; // for example take "書く" from "書く/かく"
      if (baseforms.indexOf(value) == -1) {
        baseforms.push(value);
      }
    }

    return baseforms;
  }
}

interface Variant {
  value: string;
  reading: string;
  reasons: JumanStringPos.AsObject[];
  isBaseform: boolean;
  offsetStart: number;
  offsetEnd: number;
}

interface VariantsByValue {
  [key: string]: Variant;
}