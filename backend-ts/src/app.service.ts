import { Logger, Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictionaryWord } from './entities/DictionaryWord';
import { FormDetection } from './form.detection';
import { distributeFurigana, distributeFuriganaInflected } from './japanese.utils';
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

  async processText(originalText: string, clickedOffsetOriginal: number, languages: string[]): Promise<any> {
    let toReturn: any = {};

    let text = originalText.replace(/\s/g, ' ');
    this.logger.log('Start');
    //let queries = ['こんにちは'];
    //let query = '動きたい';

    //this.logger.log(JSON.stringify(this.formDetection.reasons));
    //this.logger.log(JSON.stringify(this.formDetection.deinflect(query)));

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

    if (clickedIndex) {
      this.logger.log('Lookback');
      // Lookback
      let lookback = this.lookaround(morphemesList, clickedIndex, clickedOffset, -1, []);
      this.logger.log('Lookahead');
      // Lookahead
      let forLookaheadVariants = lookback.filter(v => !v.isBaseform);
      let lookahead = this.lookaround(morphemesList, clickedIndex, clickedOffset, +1, forLookaheadVariants);

      let allVariants = [...lookback, ...lookahead];
      allVariants = allVariants.filter(v => v.value.length <= 10);

      //console.log(allVariants);

      this.logger.log('Done');

      let queries = allVariants.map(v => v.value);

      this.logger.log('Query words in DB');
      let wordsFromDb = await this.dictionaryWordRepository.createQueryBuilder("words").where("query && ARRAY[:...queries]", { queries }).getMany();
      this.logger.log('Done');

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

      resultWords.sort((a, b) => {
        let r = b.value.length - a.value.length;
        if (r == 0) {
          r = (a.isBaseform ? 1 : 0) - (b.isBaseform ? 1 : 0);
        }
        return r;
      });

      toReturn.success = true;
      toReturn.words = resultWords;

      console.log({ languages });
      for (let word of toReturn.words) {
        word.translations = [];
        if (word?.sourceData?.sense) {
          for (let sense of word?.sourceData?.sense) {
            for (let translation of sense.gloss) {
              if (languages.indexOf(translation.lang) !== -1) {
                word.translations.push(translation);
              }
            }
          }
        }
        word.translations.sort((a, b) => {
          return languages.indexOf(a.lang) - languages.indexOf(b.lang);
        });

        word.kana = [];
        if (word?.sourceData?.kana) {
          for (let kanaTmp of word?.sourceData?.kana) {
            let kana : any = { text: kanaTmp.text, common: kanaTmp.common };
            kana.furigana = distributeFurigana(word.value, kana.text);
            word.kana.push(kana);
          }
        }
      }

      if (resultWords[0]) {
        toReturn.offsetStart = resultWords[0].offsetStart;
        toReturn.offsetEnd = resultWords[0].offsetEnd;
      }

      return toReturn;
    }


    //let result = await this.dictionaryWordRepository.createQueryBuilder("words").where("query &^| ARRAY[:...queries]", {queries}).getMany();
    //this.logger.log(JSON.stringify(result.toObject()));
    //return JSON.stringify(result);
    //this.logger.log("got result");

    return { success: false };
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
          let valueBaseform: string;
          if (direction == -1) {
            value = current.surface + currentVariant.value;
            reading = current.reading + currentVariant.reading;
            offsetStart = clickedOffset + direction * lookedLength;
            offsetEnd = currentVariant.offsetEnd;
          }
          else {
            if (!currentVariant.isBaseform && current.surface != current.baseform) {
              valueBaseform = currentVariant.value + this.processBaseform(current.baseform);
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

          if (valueBaseform) {
            variants.push({
              value: valueBaseform,
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
            reasons: addToReasons ? [current.stringPos] : [],
            isBaseform: false,
            offsetStart,
            offsetEnd,
          });
          if (current.surface != current.baseform) {
            variants.push({
              value: this.processBaseform(current.baseform),
              reading: current.reading,
              reasons: addToReasons ? [current.stringPos] : [],
              isBaseform: true,
              offsetStart,
              offsetEnd,
            });
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

      //if (!isSuffix) {
      if (lookedLength <= 10) {
        if (!reachedTheWord || !isPartical) {
          allVariants.push(...variants);
          reachedTheWord = true;
        }
      }
      else {
        break;
      }
      //}
      //console.log({ offset: direction * lookedLength, current, isSuffix, variants });
      if (direction == +1) {
        lookedLength += current.surface.length;
      }
    }
    allVariants.push(...variants);

    return allVariants;
  }

  processBaseform(baseform: string): string {
    if (baseform.substr(-1) == 'だ') {
      return baseform.substr(0, baseform.length - 1);
    }
    if (baseform.substr(-2) == 'する') {
      return baseform.substr(0, baseform.length - 2);
    }
    return baseform;
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